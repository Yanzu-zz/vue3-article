/** 类型定义 */
export interface ResponseType<P = {}> {
  code: number
  message: string
  data: P
}

export interface UserProps {
  isLogin: boolean
  nickName?: string
  _id?: string
  column?: string
  email?: string
  avatar?: ImageProps
  description?: string
}

export interface ImageProps {
  _id?: string
  url?: string
  createdAt?: string
  fitUrl?: string
}

export interface ColumnProps {
  _id: string
  title: string
  avatar?: ImageProps
  description: string
}

export interface PostProps {
  _id: string
  title: string
  createdAt: string
  column: string | UserProps
  excerpt?: string
  content?: string
  image?: ImageProps | string
  author?: string | UserProps
  isHTML?: boolean
}

interface ListProps<P> {
  [id: string]: P
}

export interface GlobalErrorProps {
  status: boolean
  message?: string
}

export interface GlobalDataProps {
  token: string
  error: GlobalErrorProps
  loading: boolean
  columns: { data: ListProps<ColumnProps>, currentPage: number, total: number }
  posts: { data: ListProps<PostProps>, loadedColumns: string[] }
  user: UserProps
}
