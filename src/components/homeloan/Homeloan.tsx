import { useState, useMemo } from 'react';
import {
    formatInputNumber,
    parseFormattedValue,
    formatCurrency,
    formatTenure,
    calculateStandardAmortization
} from './loanUtils';

const Homeloan = () => {
    // Store as formatted strings
    const [principal, setPrincipal] = useState<string>('35,00,000');
    const [interestRate, setInterestRate] = useState<string>('7.25');
    const [tenureYears, setTenureYears] = useState<string>('15');
    const [monthlyPrepayment, setMonthlyPrepayment] = useState<string>('0');
    const [yearlyPrepayment, setYearlyPrepayment] = useState<string>('0');
    const { emi, totalInterest, totalPayment, schedule, totalMonthsTaken, originalMonths, originalTotalInterest, interestSaved } = useMemo(() => {
        return calculateStandardAmortization(
            parseFormattedValue(principal),
            Number(interestRate) || 0,
            Number(tenureYears) || 0,
            parseFormattedValue(monthlyPrepayment),
            parseFormattedValue(yearlyPrepayment)
        );
    }, [principal, interestRate, tenureYears, monthlyPrepayment, yearlyPrepayment]);

    return (
        <div>
            <div className="row g-4">
                <div className="col-lg-6 col-md-12 d-flex">
                    <div className="card shadow-sm border-0 rounded-3 w-100">
                        <div className="card-body p-0 table-responsive">
                            <table className="table table-bordered table-striped mb-0 align-middle h-100">
                                <thead className="table-light">
                                    <tr>
                                        <th colSpan={2} className="text-center py-2 py-md-3 fs-5">Home Loan Details</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="fw-semibold px-3 px-md-4 py-2 py-md-3" style={{ width: '45%', minWidth: '150px' }}>Principal Amount (₹)</td>
                                        <td className="px-3 px-md-4 py-2 py-md-3">
                                            <input
                                                type="text"
                                                inputMode="decimal"
                                                className="form-control form-control-sm"
                                                value={principal}
                                                onChange={(e) => setPrincipal(formatInputNumber(e.target.value))}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="fw-semibold px-3 px-md-4 py-2 py-md-3">Interest Rate (% P.A.)</td>
                                        <td className="px-3 px-md-4 py-2 py-md-3">
                                            <input
                                                type="number"
                                                className="form-control form-control-sm"
                                                value={interestRate}
                                                step="0.1"
                                                min="0"
                                                onChange={(e) => setInterestRate(e.target.value)}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="fw-semibold px-3 px-md-4 py-2 py-md-3">Loan Tenure (Years)</td>
                                        <td className="px-3 px-md-4 py-2 py-md-3">
                                            <input
                                                type="number"
                                                className="form-control form-control-sm"
                                                value={tenureYears}
                                                min="0"
                                                onChange={(e) => setTenureYears(e.target.value)}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="fw-semibold px-3 px-md-4 py-2 py-md-3 text-success">Monthly Pre-payment (₹)</td>
                                        <td className="px-3 px-md-4 py-2 py-md-3">
                                            <input
                                                type="text"
                                                inputMode="decimal"
                                                className="form-control form-control-sm border-success"
                                                value={monthlyPrepayment}
                                                onChange={(e) => setMonthlyPrepayment(formatInputNumber(e.target.value))}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="fw-semibold px-3 px-md-4 py-2 py-md-3 text-success">Yearly Pre-payment (₹)</td>
                                        <td className="px-3 px-md-4 py-2 py-md-3">
                                            <input
                                                type="text"
                                                inputMode="decimal"
                                                className="form-control form-control-sm border-success"
                                                value={yearlyPrepayment}
                                                onChange={(e) => setYearlyPrepayment(formatInputNumber(e.target.value))}
                                                placeholder="(Applied in Dec)"
                                            />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="col-lg-6 col-md-12 d-flex">
                    <div className="card shadow-sm border-0 rounded-3 w-100">
                        <div className="card-body p-0 table-responsive">
                            <table className="table table-bordered table-striped mb-0 align-middle h-100">
                                <thead className="table-light">
                                    <tr>
                                        <th colSpan={2} className="text-center py-2 py-md-3 fs-5">Original Loan Quote</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="fw-semibold px-3 px-md-4 py-2 py-md-3 text-secondary" style={{ width: '45%', minWidth: '150px' }}>Base Monthly EMI</td>
                                        <td className="px-3 px-md-4 py-2 py-md-3 fw-bold text-primary fs-5">{formatCurrency(emi)}</td>
                                    </tr>
                                    <tr>
                                        <td className="fw-semibold px-3 px-md-4 py-2 py-md-3 text-secondary">Total Principal</td>
                                        <td className="px-3 px-md-4 py-2 py-md-3 fw-semibold">{formatCurrency(parseFormattedValue(principal))}</td>
                                    </tr>
                                    <tr>
                                        <td className="fw-semibold px-3 px-md-4 py-2 py-md-3 text-secondary">Total Interest</td>
                                        <td className="px-3 px-md-4 py-2 py-md-3 fw-semibold">{formatCurrency(interestSaved > 0 ? originalTotalInterest : totalInterest)}</td>
                                    </tr>
                                    <tr>
                                        <td className="fw-semibold px-3 px-md-4 py-2 py-md-3 text-secondary">Total Amount Payable</td>
                                        <td className="px-3 px-md-4 py-2 py-md-3 fw-bold text-dark">{formatCurrency(parseFormattedValue(principal) + (interestSaved > 0 ? originalTotalInterest : totalInterest))}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Revised Calculation section when there is a prepayment */}
            {(interestSaved > 0 || (totalMonthsTaken > 0 && totalMonthsTaken < originalMonths)) && (
                <div className="row g-4 mt-0">
                    <div className="col-12">
                        <div className="card shadow-sm border-0 rounded-3 w-100 border-success border-start border-4">
                            <div className="card-header bg-success bg-opacity-10 text-success fw-bold py-2 py-md-3 fs-5 text-center">
                                Revised Pre-payment Savings
                            </div>
                            <div className="card-body">
                                <div className="row g-3 text-center">
                                    <div className="col-6 col-md-4">
                                        <div className="p-3 bg-light rounded bg-opacity-50 border h-100 d-flex flex-column justify-content-center">
                                            <div className="text-secondary small fw-semibold mb-1">Revised Total Interest</div>
                                            <div className="fs-5 fw-bold text-dark">{formatCurrency(totalInterest)}</div>
                                        </div>
                                    </div>
                                    <div className="col-6 col-md-4">
                                        <div className="p-3 bg-light rounded bg-opacity-50 border h-100 d-flex flex-column justify-content-center">
                                            <div className="text-secondary small fw-semibold mb-1">Revised Tenure</div>
                                            <div className="fs-5 fw-bold text-dark">{formatTenure(totalMonthsTaken)}</div>
                                        </div>
                                    </div>
                                    <div className="col-12 col-md-4">
                                        <div className="p-3 bg-light rounded bg-opacity-50 border h-100 d-flex flex-column justify-content-center">
                                            <div className="text-secondary small fw-semibold mb-1">Revised Total Payable</div>
                                            <div className="fs-5 fw-bold text-dark">{formatCurrency(totalPayment)}</div>
                                        </div>
                                    </div>
                                    <div className="col-6 col-md-6">
                                        <div className="p-3 bg-success bg-opacity-10 rounded border border-success border-opacity-25 h-100 d-flex flex-column justify-content-center">
                                            <div className="text-success small fw-semibold mb-1">Interest Saved</div>
                                            <div className="fs-5 fw-bold text-success">{formatCurrency(interestSaved)}</div>
                                        </div>
                                    </div>
                                    <div className="col-6 col-md-6">
                                        <div className="p-3 bg-success bg-opacity-10 rounded border border-success border-opacity-25 h-100 d-flex flex-column justify-content-center">
                                            <div className="text-success small fw-semibold mb-1">Tenure Saved</div>
                                            <div className="fs-5 fw-bold text-success">{formatTenure(originalMonths - totalMonthsTaken)}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Amortization Schedule Accordion */}
            {schedule.length > 0 && (
                <div className="card shadow-sm border-0 rounded-3 mt-4 mb-4">
                    <div className="card-header bg-light py-2 py-md-3 text-center">
                        <h5 className="mb-0 text-dark">Year-wise Amortization Schedule</h5>
                        <small className="text-muted d-block d-md-none mt-1">Scroll table horizontally to view full details <span aria-hidden="true">&rarr;</span></small>
                    </div>
                    <div className="card-body p-0">
                        <div className="accordion accordion-flush" id="amortizationAccordion">
                            {schedule.map((yearData) => (
                                <div className="accordion-item" key={`year-${yearData.year}`}>
                                    <h2 className="accordion-header" id={`headingYear${yearData.year}`}>
                                        <button
                                            className="accordion-button collapsed fw-semibold bg-white text-dark p-2 p-md-3"
                                            type="button"
                                            data-bs-toggle="collapse"
                                            data-bs-target={`#collapseYear${yearData.year}`}
                                            aria-expanded="false"
                                            aria-controls={`collapseYear${yearData.year}`}
                                        >
                                            <div className="d-flex flex-column flex-md-row justify-content-between w-100 pe-3 gap-1 gap-md-2">
                                                <span className="fs-6">{yearData.year}</span>
                                                <div className="d-flex flex-wrap gap-2 gap-md-3 small text-muted">
                                                    <span><span className="text-primary fw-medium">Pre-Paid:</span> {formatCurrency(yearData.yearlyPrepayment)}</span>
                                                    <span><span className="text-success fw-medium">Prin:</span> {formatCurrency(yearData.yearlyPrincipal)}</span>
                                                    <span><span className="text-danger fw-medium">Int:</span> {formatCurrency(yearData.yearlyInterest)}</span>
                                                    <span><span className="text-dark fw-medium">Balance:</span> {formatCurrency(yearData.endingBalance)}</span>
                                                </div>
                                            </div>
                                        </button>
                                    </h2>
                                    <div
                                        id={`collapseYear${yearData.year}`}
                                        className="accordion-collapse collapse"
                                        aria-labelledby={`headingYear${yearData.year}`}
                                        data-bs-parent="#amortizationAccordion"
                                    >
                                        <div className="accordion-body p-0">
                                            <div className="table-responsive">
                                                <table className="table table-sm table-striped table-bordered mb-0 align-middle" style={{ minWidth: '500px' }}>
                                                    <thead className="table-light text-center small">
                                                        <tr>
                                                            <th className="py-2 text-muted">Month</th>
                                                            <th className="py-2 text-success">Principal Paid (₹)</th>
                                                            <th className="py-2 text-danger">Interest Paid (₹)</th>
                                                            <th className="py-2 text-dark">Remaining Balance (₹)</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="small">
                                                        {yearData.months.map((m) => (
                                                            <tr key={`month-${m.monthNumber}`}>
                                                                <td className="text-center text-secondary fw-semibold py-2">
                                                                    {m.monthName}
                                                                </td>
                                                                <td className="text-end text-success pe-2 pe-md-4 py-2">
                                                                    {formatCurrency(m.principal)}
                                                                    {m.hasYearlyPrepay && <div className="text-success fw-bold mt-1" style={{ fontSize: "0.65rem" }}>+ Yearly Prepayment</div>}
                                                                </td>
                                                                <td className="text-end text-danger pe-2 pe-md-4 py-2">{formatCurrency(m.interest)}</td>
                                                                <td className="text-end text-dark fw-bold pe-2 pe-md-4 py-2">{formatCurrency(m.balance)}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Homeloan;
