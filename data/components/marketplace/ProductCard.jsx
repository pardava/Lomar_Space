'use client';
import { useState } from 'react';
import { Heart, Sofa, Sparkles } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import MagneticButton from '../ui/MagneticButton';
import ImageWithFallback from '../ui/ImageWithFallback';
import { fadeUp } from '../../lib/motion';

const formatPrice = (value, currency = 'EUR') =>
  typeof value === 'number'
    ? new Intl.NumberFormat('de-DE', { style: 'currency', currency, maximumFractionDigits: 0 }).format(value)
    : '';

/**
 * Marketplace product card.
 * product: { id, name, brand, price, currency?, image_url, match? }
 * Use inside a parent with variants={stagger()} initial="hidden" whileInView="show" for staggered entrance.
 */
export default function ProductCard({ product, saved: savedProp, onSave, onBuy, onOpen }) {
  const [savedLocal, setSavedLocal] = useState(false);
  const saved = savedProp ?? savedLocal;
  const { name, brand, price, currency, image_url, match } = product;

  const toggleSave = (e) => {
    e.stopPropagation();
    setSavedLocal((s) => !s);
    onSave?.(product, !saved);
  };

  return (
    <GlassCard
      as="article"
      lift
      variants={fadeUp}
      className="group cursor-pointer overflow-hidden p-3 transition-shadow duration-500 hover:shadow-glow-blue"
      onClick={() => onOpen?.(product)}
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-[20px] bg-lomar-surface">
        <ImageWithFallback
          src={image_url}
          alt={name}
          icon={Sofa}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.07]"
        />
        {typeof match === 'number' && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-lomar-champagne/30 bg-lomar-bg/60 px-3 py-1.5 text-sm font-medium text-lomar-champagne backdrop-blur-lomar">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            {match}% match
          </span>
        )}
        <button
          type="button"
          aria-label={saved ? `Remove ${name} from saved` : `Save ${name}`}
          aria-pressed={saved}
          onClick={toggleSave}
          className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-lomar-bg/60 backdrop-blur-lomar transition-transform hover:scale-110 active:scale-95"
        >
          <Heart className={`h-[18px] w-[18px] transition-colors ${saved ? 'fill-lomar-champagne text-lomar-champagne' : 'text-lomar-ivory'}`} />
        </button>
      </div>

      <div className="px-2 pb-2 pt-4">
        {brand && <p className="text-sm text-lomar-muted">{brand}</p>}
        <h3 className="mt-1 line-clamp-2 min-h-[2.75rem] text-card text-lomar-ivory">{name}</h3>
        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="text-xl font-medium text-lomar-ivory">{formatPrice(price, currency)}</p>
          <MagneticButton
            size="sm"
            variant="glass"
            onClick={(e) => {
              e.stopPropagation();
              onBuy?.(product);
            }}
          >
            Buy Now
          </MagneticButton>
        </div>
      </div>
    </GlassCard>
  );
}
