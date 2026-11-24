-- Rewrite saved media links from the old r2.dev address to media.adzvo.com
-- Safe to run more than once: rows already on the new address are left alone.

UPDATE settings
SET value = replace(value,
      'https://pub-d599108787ca4f3283af2c206c0a1244.r2.dev',
      'https://media.adzvo.com')
WHERE value LIKE '%pub-d599108787ca4f3283af2c206c0a1244.r2.dev%';

UPDATE service_images
SET image_url = replace(image_url,
      'https://pub-d599108787ca4f3283af2c206c0a1244.r2.dev',
      'https://media.adzvo.com')
WHERE image_url LIKE '%pub-d599108787ca4f3283af2c206c0a1244.r2.dev%';

UPDATE projects
SET image_url = replace(image_url,
      'https://pub-d599108787ca4f3283af2c206c0a1244.r2.dev',
      'https://media.adzvo.com'),
    case_study_url = replace(case_study_url,
      'https://pub-d599108787ca4f3283af2c206c0a1244.r2.dev',
      'https://media.adzvo.com')
WHERE image_url LIKE '%pub-d599108787ca4f3283af2c206c0a1244.r2.dev%'
   OR case_study_url LIKE '%pub-d599108787ca4f3283af2c206c0a1244.r2.dev%';

UPDATE insight_images
SET image_url = replace(image_url,
      'https://pub-d599108787ca4f3283af2c206c0a1244.r2.dev',
      'https://media.adzvo.com')
WHERE image_url LIKE '%pub-d599108787ca4f3283af2c206c0a1244.r2.dev%';
