import { Link } from 'react-router-dom';
import { FiArrowRight, FiMapPin } from 'react-icons/fi';
import InstitutionImage from './InstitutionImage';

const cleanLabel = (value) => String(value || '')
  .replace(/^\s*(âœ“|Ã¢Å“â€œ)\s*/, '')
  .replace(/\s+Institution\s*$/i, '')
  .trim();

const getLocation = (item) => item.address || item.location || 'Location not listed';

const getCardChips = (item, category) => {
  const chips = [];

  if (category === 'institution') {
    if (item.platform) chips.push(cleanLabel(item.platform));
    if (item.online !== undefined) chips.push(item.online ? 'Online available' : 'In-person');
    if (item.experience) chips.push(`${item.experience} yrs experience`);
    if (item.universities) chips.push(`${item.universities} partners`);
  }

  if (category === 'college') {
    if (item.ugc) chips.push(cleanLabel(item.ugc));
    if (item.ownership) chips.push(cleanLabel(item.ownership));
    if (item.experience) chips.push(`${item.experience} yrs experience`);
  }

  if (category === 'school') {
    if (item.accreditation) chips.push(cleanLabel(item.accreditation));
    if (item.ownership) chips.push(cleanLabel(item.ownership));
    if (item.experience) chips.push(`${item.experience} yrs experience`);
  }

  return chips.filter(Boolean).slice(0, 3);
};

export default function InstitutionCard({ item, category, to }) {
  const chips = getCardChips(item, category);

  return (
    <article className="child-items institution-card">
      <Link className="institution-card-media" to={to} aria-label={`View ${item.name}`}>
        <InstitutionImage name={item.name} category={category} className="logo-img" />
      </Link>
      <div className="institution-card-body">
        <div>
          <h2>{item.name}</h2>
          <p className="institution-card-location">
            <FiMapPin />
            <span>{getLocation(item)}</span>
          </p>
        </div>
        {chips.length > 0 && (
          <div className="institution-card-chips">
            {chips.map((chip) => (
              <span key={chip}>{chip}</span>
            ))}
          </div>
        )}
        <Link className="institution-card-action" to={to}>
          <span>View details</span>
          <FiArrowRight />
        </Link>
      </div>
    </article>
  );
}
