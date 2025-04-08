import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import MarkDownComponent from "@/lib/markdown";
import Dashboard from "@/components/Dashboard";

export default function PaginationDemo() {
  const message = `ARJUMAND MANZOOR

vs

Vice Chancellor, PUNJAB UNIVERSITY, Lahore High Court

and 3 others

### Summary of Case: **1995 SLD 1242, 1995 CLC 2025**

#### Key Facts:
1. The petitioner, a student of the University of the Punjab, completed her M.A. English (Previous) examination with 237 marks out of 500 and later appeared in the M.A. English (Final) examination, securing 283 marks out of 500 and achieving the first position.
2. The petitioner was accused of disclosing her identity in her answer book by correcting the dates written on the answer sheets. This act was alleged to violate Regulation 16 of the Punjab University Calendar.
3. A disciplinary process was initiated, and after two years, in May 1995, the Vice-Chancellor quashed the petitioner’s result for the M.A. English (Final) examination and disqualified her for one year under Section 15(3) of the University of the Punjab Act, 1973.

#### Legal Issues:
1. Whether the petitioner’s act of correcting dates on her answer book constituted a disclosure of identity under Regulation 16.
2. Whether the decision to quash the petitioner’s result and impose a penalty was lawful and supported by evidence.
3. Whether the delay of over two years in taking action against the petitioner was justified.

#### Court's Findings:
1. **Lack of Evidence**: The court found no evidence to prove that the petitioner intended to disclose her identity by correcting the dates. The disciplinary committee and Vice-Chancellor’s decisions were not based on any concrete evidence.
2. **Improper Application of Regulation 16**: Regulation 16 requires positive proof of unfair practices, such as disclosing identity, to impose penalties. The petitioner’s act of correcting the date was deemed a genuine mistake and not an identification mark.
3. **Delay in Action**: The court noted that the university authorities took over two years to act on the alleged misconduct, which was unreasonable and caused undue hardship to the petitioner.
4. **Brilliant Academic Record**: The petitioner had an excellent academic record, which further supported the conclusion that she did not intend to disclose her identity or gain an unfair advantage.
5. **University’s Admission**: The university’s legal advisor admitted that the action taken against the petitioner could not be defended, and the university chose not to contest the case.

#### Decision:
The court declared the notification quashing the petitioner’s result as unlawful and without legal effect. The petitioner’s writ petition was accepted, and her result was reinstated. No costs were awarded.

#### Key Takeaway:
The case underscores the importance of evidence and procedural fairness in disciplinary actions by educational institutions. Mere allegations or assumptions without proof cannot justify penalties, particularly when they have severe consequences for a student’s academic and professional future.`;

  return (
    <>
      <Dashboard />
      <MarkDownComponent>{message}</MarkDownComponent>
    </>
  );
}
