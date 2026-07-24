export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
 
  }).format(amount);
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  
}

export function truncate(text: string, maxLength: number): string {

}
