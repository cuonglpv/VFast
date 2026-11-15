export function ErrorState({ message = 'Unable to load data.' }: { message?: string }) {
  return <p role="alert">{message}</p>;
}
