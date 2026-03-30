export function VideoEmbed({ videoId, title }: { videoId: string; title: string }) {
  return (
    <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-border glow-teal">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 w-full h-full"
      />
    </div>
  )
}
