SELECT
  CASE
    WHEN g.Grade < 8 THEN NULL
    else s.Name
  END as student_name,
  g.Grade,
  s.Marks
FROM
  Students s
  INNER JOIN Grades g ON s.Marks >= g.Min_Mark
  AND s.Marks <= g.Max_Mark
ORDER BY
  g.Grade DESC,
  CASE
    WHEN student_name IS NOT NULL THEN s.Name
  END ASC,
  CASE
    WHEN student_name IS NULL THEN s.Marks
  END ASC;
