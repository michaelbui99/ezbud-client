
export function unquote(s: string | undefined): string {
  if (!s){
    return "";
  }
  if (!isQuoted(s)) {
    return s;
  }

  return s.slice(1, s.length - 1);
}

function isQuoted(s: string): boolean {
  const isDoubleQuoted = s.startsWith('"') && s.endsWith('"');
  const isSingleQuoted = s.startsWith("'") && s.endsWith("'");
  return isDoubleQuoted || isSingleQuoted;
}
