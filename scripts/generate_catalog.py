#!/usr/bin/env python3
"""
Generador del catálogo final de Clientum.

Lee el catálogo curado que usa el CRM (src/data/servicios-catalogo.json,
425 productos) y le aplica el esquema de enriquecimiento que definimos en
la conversación con ChatGPT (attached_assets/chatgpt-export-2026-07-13...):

  - Categoría: dominio del servicio (se mantiene la taxonomía curada, con
    el desdoblamiento de "Inteligencia Artificial" fuera de Automatización
    y Business Intelligence).
  - Software: plataforma tecnológica asociada (Dolibarr, WordPress,
    WooCommerce, n8n, Metabase, Mautic, Open WebUI/Ollama, Multiplataforma).
  - Tipo: naturaleza del servicio (Implementación, Consultoría,
    Capacitación, Soporte, Integración, Plugin, Módulo Dolibarr, Plantilla).
  - Tags, SEO Keyword y Meta Description generados a partir de los campos
    anteriores (nada inventado: se derivan de datos que ya existen).
  - Descripción corta/larga normalizadas a partir de la descripción
    original (title-case raro -> oración prolija + CTA estándar).

Salidas:
  1. src/data/servicios-catalogo.json  — actualizado in-place (el CRM lo
     sigue consumiendo vía crmInitialData.ts, con los campos nuevos).
  2. exports/clientum-catalogo-final.csv — listo para importar en
     WooCommerce, con las columnas del template subido por el usuario
     (clientum-catalogo-final-v2.csv) + SEO Keyword / Meta Description.

Volver a ejecutar este script cada vez que se actualice
servicios-catalogo.json regenera ambos artefactos de forma consistente.
"""
import json
import re
import csv
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CATALOG_PATH = ROOT / "src" / "data" / "servicios-catalogo.json"
CSV_OUT_PATH = ROOT / "exports" / "clientum-catalogo-final.csv"

# ---------------------------------------------------------------------------
# Reglas de clasificación (basadas en palabras clave del nombre/descripción)
# ---------------------------------------------------------------------------

SOFTWARE_RULES = [
    ("Dolibarr", r"dolibarr"),
    ("WooCommerce", r"woocommerce"),
    ("WordPress", r"wordpress"),
    ("n8n", r"\bn8n\b"),
    ("Metabase", r"metabase"),
    ("Mautic", r"mautic"),
    ("Open WebUI / Ollama", r"open\s*web\s*ui|ollama"),
]

TIPO_RULES = [
    ("Plugin", r"\bplugin\b"),
    ("Módulo Dolibarr", r"m[oó]dulo.*dolibarr|dolibarr.*m[oó]dulo"),
    ("Plantilla", r"plantilla|template"),
    ("Capacitación", r"capacitaci[oó]n|curso|training|formaci[oó]n|taller"),
    ("Consultoría", r"consultor[ií]a|auditor[ií]a|asesor[ií]a|assessment"),
    ("Integración", r"integraci[oó]n|integration|conector"),
    ("Soporte", r"soporte|mantenimiento|monitoreo|maintenance|support"),
]

IA_KEYWORDS = r"inteligencia artificial|\bia\b|machine learning|\bml\b|chatbot|\bgpt\b|deep learning|aprendizaje autom[aá]tico"

VALUE_PROP_BY_CATEGORY = {
    "ERP": "centralizar la gestión administrativa, contable y de stock en un solo sistema",
    "CRM": "ordenar el seguimiento comercial y no perder oportunidades de venta",
    "Automatización": "eliminar tareas manuales repetitivas y ganar horas de trabajo por semana",
    "Inteligencia Artificial": "aplicar IA de forma práctica a procesos reales del negocio",
    "Desarrollo Web": "tener presencia digital profesional y funcional",
    "E-Commerce": "vender online de forma segura y escalable",
    "Marketing Digital": "atraer y convertir más clientes con estrategias medibles",
    "Hosting e Infraestructura": "contar con infraestructura estable, rápida y segura",
    "Business Intelligence": "tomar decisiones basadas en datos reales del negocio",
    "Integraciones": "conectar sus sistemas actuales sin duplicar tareas",
    "Soporte": "resolver incidentes técnicos con rapidez y sin fricción",
    "Ciberseguridad": "proteger su información y operar con tranquilidad",
    "Comunicación": "mejorar la colaboración interna y con clientes",
    "Soluciones por Industria": "resolver necesidades específicas de su rubro",
    "Capacitación": "que su equipo aproveche al máximo las herramientas implementadas",
}

DEFAULT_VALUE_PROP = "profesionalizar su operación con tecnología a medida"


def classify_software(name: str, desc: str) -> str:
    text = f"{name} {desc}".lower()
    for label, pattern in SOFTWARE_RULES:
        if re.search(pattern, text):
            return label
    return "Multiplataforma"


def classify_tipo(name: str, desc: str) -> str:
    text = f"{name} {desc}".lower()
    for label, pattern in TIPO_RULES:
        if re.search(pattern, text):
            return label
    return "Implementación"


def refine_category(cat: str, name: str, desc: str) -> str:
    text = f"{name} {desc}".lower()
    if cat in ("Automatización", "Business Intelligence") and re.search(IA_KEYWORDS, text):
        return "Inteligencia Artificial"
    return cat


def sentence_case(text: str) -> str:
    """The source desc field is Title-Cased oddly ('Servicios De Consultoría Y...').
    Normalize it to a proper sentence without inventing new content."""
    text = text.strip().rstrip(".")
    if not text:
        return text
    lowered = " ".join(
        w if w.isupper() and 2 <= len(w) <= 4 else w.lower() for w in text.split()
    )
    return lowered[0].upper() + lowered[1:] + "."


def build_long_description(name: str, short_desc: str, category: str) -> str:
    value_prop = VALUE_PROP_BY_CATEGORY.get(category, DEFAULT_VALUE_PROP)
    return (
        f"{short_desc} Pensado para PyMEs que buscan {value_prop}. "
        f"Incluye acompañamiento del equipo de Clientum durante toda la implementación "
        f"y soporte post-entrega. ¿Querés más información sobre \"{name}\"? "
        f"Solicitá una demo sin cargo."
    )


def build_seo_keyword(category: str, tipo: str, software: str) -> str:
    parts = [category, tipo]
    if software != "Multiplataforma":
        parts.append(software)
    return " ".join(parts).lower()


def build_meta_description(name: str, short_desc: str) -> str:
    base = f"{name}: {short_desc}"
    if len(base) > 150:
        base = base[:147].rstrip() + "..."
    return base + " Pedí tu presupuesto con Clientum."


def enrich_items(items):
    enriched = []
    for item in items:
        name = item["name"]
        raw_desc = item.get("desc") or ""
        original_cat = item["cat"]

        category = refine_category(original_cat, name, raw_desc)
        software = classify_software(name, raw_desc)
        tipo = classify_tipo(name, raw_desc)

        short_desc = sentence_case(raw_desc) if raw_desc else f"{name}."
        long_desc = build_long_description(name, short_desc, category)
        tags = sorted({category, tipo, software, "Clientum"})
        seo_keyword = build_seo_keyword(category, tipo, software)
        meta_description = build_meta_description(name, short_desc)

        enriched.append({
            **item,
            "cat": category,
            "desc": short_desc,
            "software": software,
            "tipo": tipo,
            "tags": tags,
            "seoKeyword": seo_keyword,
            "metaDescription": meta_description,
            "longDesc": long_desc,
        })
    return enriched


def write_json(items):
    CATALOG_PATH.write_text(
        json.dumps(items, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )


def write_csv(items):
    CSV_OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    fieldnames = [
        "ID", "Type", "SKU", "Name", "Published", "Short description",
        "Description", "In stock?", "Regular price", "Categories", "Tags",
        "Software", "Tipo", "SEO Keyword", "Meta Description",
    ]
    with CSV_OUT_PATH.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for idx, item in enumerate(items, start=1):
            price = item.get("price")
            try:
                price_str = f"{float(price):.2f}" if price not in (None, "") else ""
            except (TypeError, ValueError):
                price_str = str(price) if price else ""
            writer.writerow({
                "ID": idx,
                "Type": "simple",
                "SKU": item["id"],
                "Name": item["name"],
                "Published": 1,
                "Short description": item["desc"],
                "Description": item["longDesc"],
                "In stock?": 1,
                "Regular price": price_str,
                "Categories": item["cat"],
                "Tags": ",".join(item["tags"]),
                "Software": item["software"],
                "Tipo": item["tipo"],
                "SEO Keyword": item["seoKeyword"],
                "Meta Description": item["metaDescription"],
            })


def main():
    raw_items = json.loads(CATALOG_PATH.read_text(encoding="utf-8"))
    enriched = enrich_items(raw_items)
    write_json(enriched)
    write_csv(enriched)

    from collections import Counter
    cats = Counter(i["cat"] for i in enriched)
    tipos = Counter(i["tipo"] for i in enriched)
    softwares = Counter(i["software"] for i in enriched)

    print(f"{len(enriched)} productos procesados.")
    print(f"Categorías ({len(cats)}): {dict(cats)}")
    print(f"Tipos ({len(tipos)}): {dict(tipos)}")
    print(f"Software ({len(softwares)}): {dict(softwares)}")
    print(f"CSV generado en: {CSV_OUT_PATH.relative_to(ROOT)}")
    print(f"JSON actualizado en: {CATALOG_PATH.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
