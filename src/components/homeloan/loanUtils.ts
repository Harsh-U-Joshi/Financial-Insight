export const formatInputNumber = (value: string) => {
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

export const parseFormattedValue = (val: string) => Number(val.replace(/,/g, '')) || 0;

export const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(value);
};

export const formatTenure = (months: number) => {
    const y = Math.floor(months / 12);
    const m = months % 12;
    if (y === 0) return `${m} Months`;
    if (m === 0) return `${y} Years`;
    return `${y} Years ${m} Months`;
};

export interface AmortizationMonth {
    monthName: string;
    monthNumber: number;
    interest: number;
    principal: number;
    balance: number;
    hasYearlyPrepay: boolean;
}

export interface AmortizationYear {
    year: number;
    yearlyInterest: number;
    yearlyPrincipal: number;
    yearlyPrepayment: number;
    endingBalance: number;
    months: AmortizationMonth[];
}

export interface CalculationResult {
    emi: number;
    totalInterest: number;
    totalPayment: number;
    schedule: AmortizationYear[];
    totalMonthsTaken: number;
    originalMonths: number;
}

export const calculateStandardAmortization = (
    p: number,
    ratePerAnnum: number,
    tenureYears: number,
    mPrepay: number,
    yPrepay: number
): CalculationResult => {
    const r = (Number(ratePerAnnum) || 0) / 12 / 100;
    const n = (Number(tenureYears) || 0) * 12;

    if (p <= 0 || r <= 0 || n <= 0) {
        return { emi: 0, totalInterest: 0, totalPayment: 0, schedule: [], totalMonthsTaken: 0, originalMonths: 0 };
    }

    const emiCalc = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

    const amortSchedule: AmortizationYear[] = [];
    let currentBalance = p;
    let actualTotalInterest = 0;
    let actualTotalPayment = 0;
    let totalMonthsTaken = 0;

    const currentDate = new Date();
    let startingYear = currentDate.getFullYear();
    let startingMonth = currentDate.getMonth() + 2; // Next month (1-indexed)
    if (startingMonth > 12) {
        startingMonth -= 12;
        startingYear++;
    }

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let currentLoopYear = 1;

    while (currentBalance > 0) {
        const months: AmortizationMonth[] = [];
        let yearlyInterest = 0;
        let yearlyPrincipal = 0;
        let yearlyPrepaymentSum = 0;
        const actualYear = startingYear + (currentLoopYear - 1);
        const startMonthForLoop = currentLoopYear === 1 ? startingMonth : 1;

        for (let month = startMonthForLoop; month <= 12; month++) {
            if (currentBalance <= 0) break;
            
            totalMonthsTaken++;

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
        schedule: amortSchedule,
        totalMonthsTaken,
        originalMonths: n
    };
};
