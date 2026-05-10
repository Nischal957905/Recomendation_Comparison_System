import { useMemo, useState } from "react";

const normalizeImageName = (name = "") => name.trim().replace(/\s+/g, "_");

const encodePath = (path) => path.split("/").map((part, index) => index === 0 ? part : encodeURIComponent(part)).join("/");

const buildImageCandidates = (name, category = "institution") => {
  const cleanName = name || "";
  const underscored = normalizeImageName(cleanName);
  const commonPaths = [
    `/images/${underscored}.jpg`,
    `/images/${cleanName}.jpg`,
  ];

  if (category === "school" || category === "college") {
    return [
      `/school-images/${cleanName}.jpg`,
      `/school-images/${underscored}.jpg`,
      ...commonPaths,
      "/logo.png",
    ].map(encodePath);
  }

  return [...commonPaths, "/logo.png"].map(encodePath);
};

export default function InstitutionImage({
  name,
  category = "institution",
  className,
  loading = "lazy",
}) {
  const candidates = useMemo(() => buildImageCandidates(name, category), [name, category]);
  const [imageIndex, setImageIndex] = useState(0);

  return (
    <img
      src={candidates[imageIndex]}
      alt={name || "Institution"}
      className={className}
      loading={loading}
      decoding="async"
      onError={() => setImageIndex((current) => Math.min(current + 1, candidates.length - 1))}
    />
  );
}
