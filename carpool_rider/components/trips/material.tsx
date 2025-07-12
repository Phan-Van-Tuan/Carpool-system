export const getStatusColor = (status: string, colors: any) => {
  switch (status) {
    case "finished":
    case "matched":
      return colors.theme.success;
    case "pending":
      return colors.theme.info;
    case "process":
      return colors.theme.info;
    case "ending":
      return colors.theme.warring;
    default:
      return colors.theme.textSecondary;
  }
};

export const getStatusText = (status: string, t: any) => {
  switch (status) {
    case "pending":
      return t("trips.pending");
    case "process":
      return t("trips.inProgress");
    case "finished":
      return t("trips.completed");
    case "ending":
      return t("trips.completed");
    case "canceled":
      return t("trips.cancelled");
    default:
      return t("trips.pending");
  }
};
