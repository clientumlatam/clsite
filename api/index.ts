export default (req: any, res: any) => {
  res.status(200).json({ ok: true, message: 'Function api/index.ts is present' });
};
