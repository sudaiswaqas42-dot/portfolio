import { usePortfolio } from '../context/PortfolioContext';
import catalog from '../../../shared/contentCatalog.json';

export function useContent() {
  const { data } = usePortfolio();
  return (key) => data.content?.[key] ?? catalog[key]?.value ?? '';
}
