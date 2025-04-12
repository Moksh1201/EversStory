export interface Post {
    _id: string;
    imageUrl: string;
    caption: string;
    visibility: "public" | "private";
    author: {
      name: string;
      email: string;
    };
    createdAt: string;
  }
  