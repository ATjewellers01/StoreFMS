import { Package2 } from 'lucide-react';
import Heading from '../element/Heading';
import { useSheets } from '@/context/SheetsContext';
import { useEffect, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { formatDate } from '@/lib/utils';
import DataTable from '../element/DataTable';
import { Pill } from '../ui/pill';

interface HistoryData {
    timestamp: string;
    poNumber: string;
    poCopy: string;
    vendorName: string;
    preparedBy: string;
    approvedBy: string;
    totalAmount: number;
    status: 'Revised' | 'Not Recieved' | 'Recieved';
    quotationNumber: string;
    quotationDate: string;
    enquiryNumber: string;
    enquiryDate: string;
    internalCode: string;
    product: string;
    description: string;
    quantity: number;
    unit: string;
    rate: number;
    gstPercent: number;
    discountPercent: number;
    amount: number;
}

// Helper function to parse GST percentage value
const parseGSTPercent = (value: any): number => {
    if (value === null || value === undefined || value === '') {
        return 0;
    }
    const stringValue = String(value).trim();
    if (stringValue.includes('%')) {
        const numericPart = stringValue.replace('%', '').trim();
        const parsed = parseFloat(numericPart);
        return isNaN(parsed) ? 0 : parsed;
    }
    const numericValue = parseFloat(stringValue);
    if (isNaN(numericValue)) {
        return 0;
    }
    if (numericValue > 0 && numericValue < 1) {
        return numericValue * 100;
    }
    return numericValue;
};

export default () => {
    const { poMasterLoading, poMasterSheet, indentSheet, receivedSheet } = useSheets();

    const [historyData, setHistoryData] = useState<HistoryData[]>([]);

    // Fetching table data
    useEffect(() => {
        const data: HistoryData[] = poMasterSheet.map((sheet) => {
            const gstValue = sheet.gstPercent || sheet.gst || 0;
            
            return {
                timestamp: sheet.timestamp ? formatDate(new Date(sheet.timestamp)) : '',
                approvedBy: sheet.approvedBy || '',
                poCopy: sheet.pdf || '',
                poNumber: sheet.poNumber?.toString().trim() || '',
                preparedBy: sheet.preparedBy || '',
                totalAmount: Number(sheet.totalPoAmount) || 0,
                vendorName: sheet.partyName || '',
                status: indentSheet.map((s) => s.poNumber?.toString().trim()).includes(sheet.poNumber)
                    ? receivedSheet.map((r) => r.poNumber?.toString().trim()).includes(sheet.poNumber)
                        ? 'Received'
                        : 'Not Received'
                    : 'Revised',
                quotationNumber: sheet.quotationNumber || '',
                quotationDate: sheet.quotationDate ? formatDate(new Date(sheet.quotationDate)) : '',
                enquiryNumber: sheet.enquiryNumber || '',
                enquiryDate: sheet.enquiryDate ? formatDate(new Date(sheet.enquiryDate)) : '',
                internalCode: sheet.internalCode || '',
                product: sheet.product || '',
                description: sheet.description || '',
                quantity: Number(sheet.quantity) || 0,
                unit: sheet.unit || '',
                rate: Number(sheet.rate) || 0,
                gstPercent: parseGSTPercent(gstValue),
                discountPercent: Number(sheet.discountPercent) || 0,
                amount: Number(sheet.amount) || 0,
            };
        });

        // Filter for unique poNumbers
        const uniqueData = data.filter((item, index, self) =>
            index === self.findIndex((t) => t.poNumber === item.poNumber)
        );

        setHistoryData(uniqueData);
    }, [indentSheet, poMasterSheet, receivedSheet]);

    // Creating table columns
    const historyColumns: ColumnDef<HistoryData>[] = [
        { accessorKey: 'timestamp', header: 'Date' },
        { accessorKey: 'vendorName', header: 'Vendor Name' },
        { accessorKey: 'poNumber', header: 'PO Number' },
        { accessorKey: 'quotationNumber', header: 'Quotation Number' },
        { accessorKey: 'quotationDate', header: 'Quotation Date' },
        { accessorKey: 'enquiryNumber', header: 'Enquiry Number' },
        { accessorKey: 'enquiryDate', header: 'Enquiry Date' },
        { accessorKey: 'internalCode', header: 'Internal Code' },
        { accessorKey: 'product', header: 'Product' },
        { accessorKey: 'description', header: 'Description' },
        { accessorKey: 'quantity', header: 'Quantity' },
        { accessorKey: 'unit', header: 'Unit' },
        {
            accessorKey: 'rate',
            header: 'Rate',
            cell: ({ row }) => {
                return <>&#8377;{row.original.rate.toLocaleString()}</>;
            },
        },
        {
            accessorKey: 'gstPercent',
            header: 'GST %',
            cell: ({ row }) => {
                return <>{row.original.gstPercent}%</>;
            },
        },
        {
            accessorKey: 'discountPercent',
            header: 'Discount %',
            cell: ({ row }) => {
                return <>{row.original.discountPercent}%</>;
            },
        },
        {
            accessorKey: 'amount',
            header: 'Amount',
            cell: ({ row }) => {
                return <>&#8377;{row.original.amount.toLocaleString()}</>;
            },
        },
        {
            accessorKey: 'totalAmount',
            header: 'Total Order Amount',
            cell: ({ row }) => {
                return <>&#8377;{row.original.totalAmount.toLocaleString()}</>;
            },
        },
        { accessorKey: 'preparedBy', header: 'Prepared By' },
        { accessorKey: 'approvedBy', header: 'Approved By' },
        {
            accessorKey: 'poCopy',
            header: 'PO Copy',
            cell: ({ row }) => {
                const attachment = row.original.poCopy;
                return attachment ? (
                    <a
                        href={attachment}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline"
                    >
                        PDF
                    </a>
                ) : (
                    <span className="text-gray-400">No PDF</span>
                );
            },
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => {
                const variant =
                    row.original.status === 'Not Received'
                        ? 'secondary'
                        : row.original.status === 'Received'
                        ? 'primary'
                        : 'default';
                return <Pill variant={variant}>{row.original.status}</Pill>;
            },
        },
    ];

    return (
        <div>
            <Heading heading="PO History" subtext="View purchase orders">
                <Package2 size={50} className="text-primary" />
            </Heading>

            <DataTable
                data={historyData}
                columns={historyColumns}
                searchFields={[
                    'poNumber',
                    'vendorName',
                    'product',
                    'description',
                    'quotationNumber',
                    'enquiryNumber',
                    'preparedBy',
                    'approvedBy',
                ]}
                dataLoading={poMasterLoading}
                className="h-[80dvh]"
            />
        </div>
    );
};
