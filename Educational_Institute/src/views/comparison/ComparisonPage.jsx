import { useGetCompanyQuery } from "../../app/api/comparisonSlice"
import  { useParams } from 'react-router-dom'

export default function ComparisonPage(){


    const { id } = useParams();
    const {
        data,
    } = useGetCompanyQuery(id)

    return(
        <main className="page-intro">
            <span className="eyebrow">Comparison detail</span>
            <h1>Institution comparison report</h1>
            <p>This page is reserved for a saved comparison report. Use the comparison workspace to select institutions and review live scoring across service, access, experience, rating, and overall performance.</p>
        </main>
    )
}
