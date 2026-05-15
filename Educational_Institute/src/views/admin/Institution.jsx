import { useState } from "react"

export default function Institution(){


    return (
        <main className="admin-page">
            <section className="admin-page-head">
                <div>
                    <span className="eyebrow">Admin workspace</span>
                    <h1>Institution admin</h1>
                    <p>This workspace is reserved for institution administration tools.</p>
                </div>
            </section>
            <section className="admin-panel">
                <div className="admin-empty">No tools are available on this page yet.</div>
            </section>
        </main>
    )
}
