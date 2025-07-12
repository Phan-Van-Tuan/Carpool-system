const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDistance = (meters: number) => {
  if (meters < 1000) {
    return `${meters} m`;
  } else {
    return `${(meters / 1000).toFixed(1)} km`;
  }
};

const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  return `${minutes} min`;
};

export {
  formatTime,
  formatDate,
  formatCurrency,
  formatDistance,
  formatDuration,
};
