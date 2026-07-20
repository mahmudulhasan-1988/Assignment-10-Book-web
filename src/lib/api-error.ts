import toast from "react-hot-toast";

/**
 * Handle API response errors with toast notifications.
 * Returns true if the request was successful, false otherwise.
 */
export async function handleApiError(
  res: Response,
  fallbackMessage = "Something went wrong"
): Promise<boolean> {
  if (res.ok) return true;

  try {
    const data = await res.json();
    const message = data.error || data.message || fallbackMessage;

    switch (res.status) {
      case 400:
        toast.error(message || "Invalid request");
        break;
      case 401:
        toast.error("Please log in to continue");
        break;
      case 403:
        toast.error("You don't have permission to do this");
        break;
      case 404:
        toast.error(message || "Resource not found");
        break;
      case 409:
        toast.error(message || "Conflict — this item may already exist");
        break;
      case 429:
        toast.error("Too many requests. Please wait a moment");
        break;
      case 500:
        toast.error(message || "Server error. Please try again later");
        break;
      default:
        toast.error(message || fallbackMessage);
    }
  } catch {
    toast.error(fallbackMessage);
  }

  return false;
}

/**
 * Safely fetch with error handling.
 * Returns the response or null on network error.
 */
export async function safeFetch(
  url: string,
  options?: RequestInit
): Promise<Response | null> {
  try {
    return await fetch(url, options);
  } catch (error: any) {
    if (error?.name === "AbortError") {
      toast.error("Request timed out");
    } else {
      toast.error("Network error. Check your connection");
    }
    return null;
  }
}
