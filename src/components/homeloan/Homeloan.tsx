import { useState, useMemo } from 'react';

const Homeloan = () => {
    // Store as formatted strings
    const [principal, setPrincipal] = useState<string>('35,00,000');
    const [interestRate, setInterestRate] = useState<string>('7.25');
    const [tenureYears, setTenureYears] = useState<string>('15');
    const [monthlyPrepayment, setMonthlyPrepayment] = useState<string>('0');
    const [yearlyPrepayment, setYearlyPrepayment] = useState<string>('0');

    const formatInputNumber = (value: string) => {
        if (!value) return '';
        const cleanValue = value.replace(/[^0-9.]/g, '');
        const parts = cleanValue.split('.');
        let intPart = parts[0];

        if (intPart !== '') {
            intPart = new Intl.NumberFormat('en-IN').format(Number(intPart));
        } else if (parts.length > 1) {
            intPart = "0";
        }

        if (parts.length > 1) {
            return intPart + '.' + parts[1];
        }
        return intPart;
    };

    const parseFormattedValue = (val: string) => Number(val.replace(/,/g, '')) || 0;

    const { emi, totalInterest, totalPayment, schedule } = useMemo(() => {
        const p = parseFormattedValue(principal);
        const r = (Number(interestRate) || 0) / 12 / 100;
        const n = (Number(tenureYears) || 0) * 12;
        const mPrepay = parseFormattedValue(monthlyPrepayment);
        const yPrepay = parseFormattedValue(yearlyPrepayment);

        if (p <= 0 || r <= 0 || n <= 0) {
            return { emi: 0, totalInterest: 0, totalPayment: 0, schedule: [] };
        }

        const emiCalc = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

        const amortSchedule = [];
        let currentBalance = p;
        let actualTotalInterest = 0;
        let actualTotalPayment = 0;

        const startYear = new Date().getFullYear();
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        let currentLoopYear = 1;

        while (currentBalance > 0) {
            const months = [];
            let yearlyInterest = 0;
            let yearlyPrincipal = 0;
            let yearlyPrepaymentSum = 0;
            const actualYear = startYear + (currentLoopYear - 1);

            for (let month = 1; month <= 12; month++) {
                if (currentBalance <= 0) break;

                const interestForMonth = currentBalance * r;
                const normalPrincipalForMonth = emiCalc - interestForMonth;
                const appliedYearlyPrepay = (month === 12) ? yPrepay : 0;

                let totalPrincipalForMonth = normalPrincipalForMonth + mPrepay + appliedYearlyPrepay;
                let prepaymentForMonth = mPrepay + appliedYearlyPrepay;

                if (currentBalance < totalPrincipalForMonth) {
                    totalPrincipalForMonth = currentBalance;
                    prepaymentForMonth = Math.max(0, currentBalance - Math.max(0, normalPrincipalForMonth));
                }

                currentBalance -= totalPrincipalForMonth;
                if (currentBalance < 0) currentBalance = 0;

                yearlyInterest += interestForMonth;
                yearlyPrincipal += totalPrincipalForMonth;
                yearlyPrepaymentSum += prepaymentForMonth;

                actualTotalInterest += interestForMonth;
                actualTotalPayment += (totalPrincipalForMonth + interestForMonth);

                months.push({
                    monthName: monthNames[month - 1],
                    monthNumber: month,
                    interest: Math.round(interestForMonth),
                    principal: Math.round(totalPrincipalForMonth),
                    balance: Math.round(currentBalance),
                    hasYearlyPrepay: month === 12 && appliedYearlyPrepay > 0 && currentBalance >= 0
                });
            }

            amortSchedule.push({
                year: actualYear,
                yearlyInterest: Math.round(yearlyInterest),
                yearlyPrincipal: Math.round(yearlyPrincipal),
                yearlyPrepayment: Math.round(yearlyPrepaymentSum),
                endingBalance: Math.round(currentBalance),
                months
            });

            currentLoopYear++;
            if (currentLoopYear > 150) break;
        }

        return {
            emi: isNaN(emiCalc) ? 0 : Math.round(emiCalc),
            totalInterest: Math.round(actualTotalInterest),
            totalPayment: Math.round(actualTotalPayment),
            schedule: amortSchedule
        };
    }, [principal, interestRate, tenureYears, monthlyPrepayment, yearlyPrepayment]);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(value);
    };

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
                                        <th colSpan={2} className="text-center py-2 py-md-3 fs-5">Calculation Results</th>
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
                                        <td className="px-3 px-md-4 py-2 py-md-3 fw-semibold">{formatCurrency(totalInterest)}</td>
                                    </tr>
                                    <tr>
                                        <td className="fw-semibold px-3 px-md-4 py-2 py-md-3 text-secondary">Total Amount Payable</td>
                                        <td className="px-3 px-md-4 py-2 py-md-3 fw-bold text-dark">{formatCurrency(totalPayment)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

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
