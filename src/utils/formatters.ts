export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return {
    dayName: date.toLocaleDateString("en-US", { weekday: "short" }),
    dayMonth: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    full: date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    }),
    simple: date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
  };
};

export const formatTime = (timeString: string) => {
  const [h, m] = timeString.split(":");
  const d = new Date();
  d.setHours(parseInt(h, 10), parseInt(m, 10));
  return d.toLocaleTimeString("en-US", { 
    hour: "numeric", 
    minute: "2-digit", 
    hour12: true 
  });
};

export const getJerseyColor = (label: string): string => {
  const colorMap: Record<string, string> = {
    BLACK: "#000000",
    BLUE: "#0000FF",
    "BLACK JERSEY": "#000000",
    "BLUE JERSEY": "#0000FF",
  };
  return colorMap[label.toUpperCase().trim()] || "#9ca3af";
};