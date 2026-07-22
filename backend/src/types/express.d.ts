// Augments Express's Request type so `req.user` is typed everywhere
// once the auth middleware has run.
// Note: TokenPayload shape is inlined here to keep this file import-free
// (imports would scope this as a module and break global augmentation with ts-node).
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
      };
    }
  }
}

export {};
