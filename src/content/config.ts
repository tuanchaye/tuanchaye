import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    category: z.string().optional(),
    cover: z.string().optional(),
    pinned: z.boolean().optional(), // 置顶：列表排最前
    comments: z.boolean().optional(), // 是否开放评论（false=关闭）
  }),
});

export const collections = { posts };
