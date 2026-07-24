
  return new Intl.NumberFormat("en-IN", {
  
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  
}

export function truncate(text: string, maxLength: number): string {

}
