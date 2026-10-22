import { type Locale, isLocale, DEFAULT_LOCALE } from './config';

// 去掉路径中的语言前缀，得到规范路径（canonical path）
// '/en/foo' -> '/foo' ; '/zh/' -> '/' ; '/foo' -> '/foo'
export function stripLocale(pathname: string): string {
  const parts = pathname.split('/');
  if (parts[1] && isLocale(parts[1])) {
    const rest = parts.slice(2).join('/');
    return rest ? `/${rest}` : '/';
  }
  return pathname;
}

// 给路径加上语言前缀（所有语言均带前缀，含默认 en）
// withLocale('zh', '/posts/foo') -> '/zh/posts/foo'
// withLocale('en', '/') -> '/en/'
export function withLocale(locale: Locale, pathname: string): string {
  const can = stripLocale(pathname);
  if (can === '/') return `/${locale}`;
  return `/${locale}${can}`;
}

// 切换语言时，把当前页面路径映射到目标语言同名页面
export function switchLocale(currentPath: string, target: Locale): string {
  return withLocale(target, currentPath);
}

export { DEFAULT_LOCALE };
