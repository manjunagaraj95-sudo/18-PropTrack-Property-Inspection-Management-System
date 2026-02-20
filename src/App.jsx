
import React, { useState, useEffect, useCallback } from 'react';
import {
    FaBars, FaBell, FaUserCircle, FaSearch, FaPlus, FaChevronLeft, FaSave, FaEdit, FaTrash,
    FaClipboardList, FaFileAlt, FaUsers, FaChartLine, FaHistory, FaCheckCircle, FaTimesCircle,
    FaPlayCircle, FaEye, FaFileUpload, FaDownload, FaPrint, FaExclamationTriangle
} from 'react-icons/fa';
import { HiOutlineDocumentText } from "react-icons/hi";

// --- DUMMY DATA ---
const generateUniqueId = (prefix) => `${prefix}-${Math.random().toString(36).substr(2, 9)}`;

const usersData = [
    { id: 'usr-admin', name: 'Admin User', email: 'admin@proptrack.com', role: 'ADMIN' },
    { id: 'usr-mngr1', name: 'Jane Manager', email: 'jane.m@proptrack.com', role: 'MANAGER', teamId: 'team-alpha' },
    { id: 'usr-insp1', name: 'John Inspector', email: 'john.i@proptrack.com', role: 'INSPECTOR', teamId: 'team-alpha' },
    { id: 'usr-insp2', name: 'Alice Inspector', email: 'alice.i@proptrack.com', role: 'INSPECTOR', teamId: 'team-beta' },
    { id: 'usr-clnt1', name: 'Property Corp A', email: 'clientA@proptrack.com', role: 'CLIENT', clientId: 'clnt-001' },
    { id: 'usr-clnt2', name: 'Global Estates', email: 'clientB@proptrack.com', role: 'CLIENT', clientId: 'clnt-002' },
];

const clientsData = [
    { id: 'clnt-001', name: 'Property Corp A', contactPerson: 'Sarah Connor', contactEmail: 'sarah.c@propertycorpa.com' },
    { id: 'clnt-002', name: 'Global Estates', contactPerson: 'Miles Dyson', contactEmail: 'miles.d@globalestates.com' },
    { id: 'clnt-003', name: 'Urban Developers', contactPerson: 'Reese Harrison', contactEmail: 'reese.h@urbandev.com' },
];

const propertiesData = [
    { id: 'prop-001', address: '123 Main St, Anytown USA', clientId: 'clnt-001' },
    { id: 'prop-002', address: '456 Oak Ave, Anytown USA', clientId: 'clnt-001' },
    { id: 'prop-003', address: '789 Pine Ln, Otherville USA', clientId: 'clnt-002' },
    { id: 'prop-004', address: '101 Elm Dr, Otherville USA', clientId: 'clnt-002' },
    { id: 'prop-005', address: '202 Maple Blvd, Greentown USA', clientId: 'clnt-003' },
];

const inspectionStatuses = ['DRAFT', 'SCHEDULED', 'ASSIGNED', 'IN_PROGRESS', 'PENDING_REVIEW', 'APPROVED', 'REJECTED', 'OVERDUE', 'CLOSED'];
const reportStatuses = ['DRAFT', 'SUBMITTED', 'REVIEWED', 'APPROVED', 'REJECTED'];

const generateWorkflowHistory = (status) => {
    let history = [{ stage: 'DRAFT', by: 'System', date: '2023-01-01T09:00:00Z', comments: 'Inspection created.' }];
    if (['SCHEDULED', 'ASSIGNED', 'IN_PROGRESS', 'PENDING_REVIEW', 'APPROVED', 'REJECTED', 'OVERDUE', 'CLOSED'].includes(status)) {
        history.push({ stage: 'SCHEDULED', by: 'Admin User', date: '2023-01-02T10:00:00Z', comments: 'Scheduled for inspection.' });
    }
    if (['ASSIGNED', 'IN_PROGRESS', 'PENDING_REVIEW', 'APPROVED', 'REJECTED', 'OVERDUE', 'CLOSED'].includes(status)) {
        history.push({ stage: 'ASSIGNED', by: 'Admin User', date: '2023-01-03T11:00:00Z', comments: 'Assigned to inspector.' });
    }
    if (['IN_PROGRESS', 'PENDING_REVIEW', 'APPROVED', 'REJECTED', 'OVERDUE', 'CLOSED'].includes(status)) {
        history.push({ stage: 'IN_PROGRESS', by: 'John Inspector', date: '2023-01-05T13:00:00Z', comments: 'Inspection started.' });
    }
    if (['PENDING_REVIEW', 'APPROVED', 'REJECTED', 'CLOSED'].includes(status)) {
        history.push({ stage: 'PENDING_REVIEW', by: 'John Inspector', date: '2023-01-08T15:00:00Z', comments: 'Report submitted for review.' });
    }
    if (status === 'APPROVED' || status === 'CLOSED') {
        history.push({ stage: 'APPROVED', by: 'Jane Manager', date: '2023-01-09T10:00:00Z', comments: 'Inspection report approved.' });
    } else if (status === 'REJECTED') {
        history.push({ stage: 'REJECTED', by: 'Jane Manager', date: '2023-01-09T10:00:00Z', comments: 'Inspection report rejected due to missing data.' });
    }
    if (status === 'CLOSED') {
        history.push({ stage: 'CLOSED', by: 'System', date: '2023-01-10T11:00:00Z', comments: 'Inspection closed.' });
    }
    if (status === 'OVERDUE') {
        history.push({ stage: 'OVERDUE', by: 'System', date: '2023-01-06T12:00:00Z', comments: 'Inspection went overdue.' });
    }
    return history;
};

const dummyInspections = [
    {
        id: 'insp-001',
        title: 'Q1 Structural Review - Main St',
        propertyAddress: propertiesData[0].address,
        propertyId: propertiesData[0].id,
        clientId: clientsData[0].id,
        inspectorId: usersData[2].id, // John Inspector
        status: 'APPROVED',
        priority: 'HIGH',
        scheduledDate: '2023-01-05',
        completionDate: '2023-01-08',
        assignedDate: '2023-01-03',
        lastUpdate: '2023-01-09T10:00:00Z',
        description: 'Comprehensive structural integrity check for Q1. Focus on foundation and roof.',
        reports: [], // Filled dynamically later
        workflowHistory: generateWorkflowHistory('APPROVED'),
        currentWorkflowStage: 'APPROVED',
        slaStatus: 'ON_TRACK',
        documents: [{ id: 'doc-001', name: 'Structural Blueprint.pdf', url: '#', type: 'PDF' }],
    },
    {
        id: 'insp-002',
        title: 'Annual HVAC Check - Oak Ave',
        propertyAddress: propertiesData[1].address,
        propertyId: propertiesData[1].id,
        clientId: clientsData[0].id,
        inspectorId: usersData[2].id, // John Inspector
        status: 'PENDING_REVIEW',
        priority: 'MEDIUM',
        scheduledDate: '2023-02-10',
        completionDate: '2023-02-12',
        assignedDate: '2023-02-08',
        lastUpdate: '2023-02-13T14:30:00Z',
        description: 'Routine annual HVAC system inspection and maintenance check.',
        reports: [],
        workflowHistory: generateWorkflowHistory('PENDING_REVIEW'),
        currentWorkflowStage: 'PENDING_REVIEW',
        slaStatus: 'ON_TRACK',
        documents: [],
    },
    {
        id: 'insp-003',
        title: 'Electrical System Audit - Pine Ln',
        propertyAddress: propertiesData[2].address,
        propertyId: propertiesData[2].id,
        clientId: clientsData[1].id,
        inspectorId: usersData[3].id, // Alice Inspector
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        scheduledDate: '2023-03-01',
        completionDate: null,
        assignedDate: '2023-02-28',
        lastUpdate: '2023-03-02T11:00:00Z',
        description: 'Full electrical system audit to ensure compliance and safety.',
        reports: [],
        workflowHistory: generateWorkflowHistory('IN_PROGRESS'),
        currentWorkflowStage: 'IN_PROGRESS',
        slaStatus: 'ON_TRACK',
        documents: [],
    },
    {
        id: 'insp-004',
        title: 'Water Damage Assessment - Elm Dr',
        propertyAddress: propertiesData[3].address,
        propertyId: propertiesData[3].id,
        clientId: clientsData[1].id,
        inspectorId: usersData[3].id, // Alice Inspector
        status: 'OVERDUE',
        priority: 'CRITICAL',
        scheduledDate: '2023-01-20',
        completionDate: null,
        assignedDate: '2023-01-18',
        lastUpdate: '2023-01-25T09:00:00Z',
        description: 'Urgent assessment of recent water damage in basement. Identify source and extent.',
        reports: [],
        workflowHistory: generateWorkflowHistory('OVERDUE'),
        currentWorkflowStage: 'OVERDUE',
        slaStatus: 'BREACHED',
        documents: [],
    },
    {
        id: 'insp-005',
        title: 'Pre-Purchase Survey - Maple Blvd',
        propertyAddress: propertiesData[4].address,
        propertyId: propertiesData[4].id,
        clientId: clientsData[2].id,
        inspectorId: usersData[2].id, // John Inspector
        status: 'SCHEDULED',
        priority: 'MEDIUM',
        scheduledDate: '2023-03-15',
        completionDate: null,
        assignedDate: '2023-03-10',
        lastUpdate: '2023-03-10T16:00:00Z',
        description: 'Standard pre-purchase property survey for potential buyer.',
        reports: [],
        workflowHistory: generateWorkflowHistory('SCHEDULED'),
        currentWorkflowStage: 'SCHEDULED',
        slaStatus: 'ON_TRACK',
        documents: [],
    },
    {
        id: 'insp-006',
        title: 'Post-Renovation Check - Main St',
        propertyAddress: propertiesData[0].address,
        propertyId: propertiesData[0].id,
        clientId: clientsData[0].id,
        inspectorId: usersData[3].id, // Alice Inspector
        status: 'REJECTED',
        priority: 'HIGH',
        scheduledDate: '2023-02-01',
        completionDate: '2023-02-03',
        assignedDate: '2023-01-29',
        lastUpdate: '2023-02-04T11:00:00Z',
        description: 'Final inspection after bathroom renovation. Check for quality and compliance.',
        reports: [],
        workflowHistory: generateWorkflowHistory('REJECTED'),
        currentWorkflowStage: 'REJECTED',
        slaStatus: 'ON_TRACK',
        documents: [],
    },
    {
        id: 'insp-007',
        title: 'Roof Condition Report - Oak Ave',
        propertyAddress: propertiesData[1].address,
        propertyId: propertiesData[1].id,
        clientId: clientsData[0].id,
        inspectorId: usersData[2].id, // John Inspector
        status: 'DRAFT',
        priority: 'LOW',
        scheduledDate: '2023-03-20',
        completionDate: null,
        assignedDate: '2023-03-18',
        lastUpdate: '2023-03-19T09:30:00Z',
        description: 'Initial draft for a new roof condition assessment.',
        reports: [],
        workflowHistory: generateWorkflowHistory('DRAFT'),
        currentWorkflowStage: 'DRAFT',
        slaStatus: 'ON_TRACK',
        documents: [],
    },
    {
        id: 'insp-008',
        title: 'Fire Safety Compliance - Pine Ln',
        propertyAddress: propertiesData[2].address,
        propertyId: propertiesData[2].id,
        clientId: clientsData[1].id,
        inspectorId: usersData[2].id, // John Inspector
        status: 'CLOSED',
        priority: 'HIGH',
        scheduledDate: '2023-01-10',
        completionDate: '2023-01-12',
        assignedDate: '2023-01-08',
        lastUpdate: '2023-01-13T16:00:00Z',
        description: 'Annual fire safety system check and compliance audit.',
        reports: [],
        workflowHistory: generateWorkflowHistory('CLOSED'),
        currentWorkflowStage: 'CLOSED',
        slaStatus: 'ON_TRACK',
        documents: [],
    },
    {
        id: 'insp-009',
        title: 'Exterior Paint Quality - Main St',
        propertyAddress: propertiesData[0].address,
        propertyId: propertiesData[0].id,
        clientId: clientsData[0].id,
        inspectorId: usersData[2].id, // John Inspector
        status: 'ASSIGNED',
        priority: 'LOW',
        scheduledDate: '2023-04-01',
        completionDate: null,
        assignedDate: '2023-03-28',
        lastUpdate: '2023-03-29T10:00:00Z',
        description: 'Assessment of exterior paint condition ahead of potential repainting project.',
        reports: [],
        workflowHistory: generateWorkflowHistory('ASSIGNED'),
        currentWorkflowStage: 'ASSIGNED',
        slaStatus: 'ON_TRACK',
        documents: [],
    },
    {
        id: 'insp-010',
        title: 'Foundation Integrity Check - Maple Blvd',
        propertyAddress: propertiesData[4].address,
        propertyId: propertiesData[4].id,
        clientId: clientsData[2].id,
        inspectorId: usersData[3].id, // Alice Inspector
        status: 'PENDING_REVIEW',
        priority: 'HIGH',
        scheduledDate: '2023-03-05',
        completionDate: '2023-03-07',
        assignedDate: '2023-03-03',
        lastUpdate: '2023-03-08T09:00:00Z',
        description: 'Detailed inspection of the property foundation for any cracks or settling.',
        reports: [],
        workflowHistory: generateWorkflowHistory('PENDING_REVIEW'),
        currentWorkflowStage: 'PENDING_REVIEW',
        slaStatus: 'PENDING_BREACH',
        documents: [],
    },
];

const dummyReports = [
    {
        id: 'rpt-001', inspectionId: 'insp-001', type: 'FINAL', inspectorId: usersData[2].id, submissionDate: '2023-01-08T16:00:00Z',
        status: 'APPROVED', summary: 'Structural integrity found excellent. Minor wear on external facade.',
        findings: ['No major structural defects found.', 'Minor hairline cracks on garage exterior.', 'Roof in good condition.'],
        recommendations: ['Seal garage cracks.', 'Schedule facade repainting in 2-3 years.'],
        images: ['https://via.placeholder.com/150/FF5733/FFFFFF?text=Facade_Crack', 'https://via.placeholder.com/150/33FF57/FFFFFF?text=Roof_Good']
    },
    {
        id: 'rpt-002', inspectionId: 'insp-002', type: 'FINAL', inspectorId: usersData[2].id, submissionDate: '2023-02-13T14:00:00Z',
        status: 'SUBMITTED', summary: 'HVAC system fully functional. Filters replaced, ducts cleaned.',
        findings: ['Air handler operating within parameters.', 'Filter replacement completed.', 'Minor dust accumulation in return ducts.'],
        recommendations: ['Routine filter replacement every 3 months.', 'Annual duct cleaning.'],
        images: ['https://via.placeholder.com/150/3357FF/FFFFFF?text=HVAC_Unit', 'https://via.placeholder.com/150/57FF33/FFFFFF?text=Clean_Filter']
    },
    {
        id: 'rpt-003', inspectionId: 'insp-004', type: 'INITIAL', inspectorId: usersData[3].id, submissionDate: '2023-01-22T10:00:00Z',
        status: 'REJECTED', summary: 'Preliminary assessment indicates significant water ingress.',
        findings: ['Active leak visible in basement corner.', 'Water stains on drywall.', 'Mold growth observed on baseboards.'],
        recommendations: ['Urgent plumbing inspection.', 'Mold remediation required.'],
        images: ['https://via.placeholder.com/150/DC3545/FFFFFF?text=Water_Damage', 'https://via.placeholder.com/150/FFC107/FFFFFF?text=Mold_Growth']
    },
    {
        id: 'rpt-004', inspectionId: 'insp-006', type: 'FINAL', inspectorId: usersData[3].id, submissionDate: '2023-02-03T10:00:00Z',
        status: 'REJECTED', summary: 'Post-renovation check found several issues.',
        findings: ['Tiling grout inconsistent.', 'Faucet not properly sealed.', 'Ventilation fan not up to code.'],
        recommendations: ['Regrout bathroom.', 'Reseal faucet.', 'Replace ventilation fan.'],
        images: ['https://via.placeholder.com/150/FF5733/FFFFFF?text=Grout_Issue']
    },
    {
        id: 'rpt-005', inspectionId: 'insp-007', type: 'DRAFT', inspectorId: usersData[2].id, submissionDate: '2023-03-19T10:00:00Z',
        status: 'DRAFT', summary: 'Initial observations for roof condition report.',
        findings: ['Asphalt shingles show signs of aging.', 'Gutter system appears clear.', 'No immediate leaks detected from interior.'],
        recommendations: [],
        images: []
    },
    {
        id: 'rpt-006', inspectionId: 'insp-008', type: 'FINAL', inspectorId: usersData[2].id, submissionDate: '2023-01-12T14:00:00Z',
        status: 'APPROVED', summary: 'Fire safety systems fully operational and compliant.',
        findings: ['Smoke detectors tested and functional.', 'Fire extinguishers in date.', 'Emergency exits clear.'],
        recommendations: ['Annual review of fire safety plan.'],
        images: ['https://via.placeholder.com/150/28A745/FFFFFF?text=Fire_Alarm']
    },
    {
        id: 'rpt-007', inspectionId: 'insp-010', type: 'FINAL', inspectorId: usersData[3].id, submissionDate: '2023-03-07T14:00:00Z',
        status: 'SUBMITTED', summary: 'Minor foundation settling observed.',
        findings: ['Hairline crack in north-east foundation wall.', 'No active water ingress in foundation.', 'Soil grading is adequate.'],
        recommendations: ['Monitor crack annually.', 'Consider sealing if crack widens.'],
        images: ['https://via.placeholder.com/150/FFC107/FFFFFF?text=Foundation_Crack']
    },
];

// Link reports to inspections
dummyInspections.forEach(insp => {
    insp.reports = dummyReports.filter(rpt => rpt.inspectionId === insp.id).map(rpt => rpt.id);
});


const auditLogsData = [
    { id: 'log-001', timestamp: '2023-03-29T10:05:00Z', userId: 'usr-insp2', userName: 'Alice Inspector', action: 'ASSIGN_INSPECTION', entityType: 'INSPECTION', entityId: 'insp-009', details: 'Assigned inspection insp-009 to Alice Inspector' },
    { id: 'log-002', timestamp: '2023-03-28T16:00:00Z', userId: 'usr-admin', userName: 'Admin User', action: 'CREATE_INSPECTION', entityType: 'INSPECTION', entityId: 'insp-009', details: 'New inspection "Exterior Paint Quality - Main St" created.' },
    { id: 'log-003', timestamp: '2023-03-19T09:35:00Z', userId: 'usr-insp1', userName: 'John Inspector', action: 'CREATE_REPORT', entityType: 'REPORT', entityId: 'rpt-005', details: 'Report rpt-005 (DRAFT) created for insp-007.' },
    { id: 'log-004', timestamp: '2023-03-10T16:05:00Z', userId: 'usr-admin', userName: 'Admin User', action: 'CREATE_INSPECTION', entityType: 'INSPECTION', entityId: 'insp-005', details: 'New inspection "Pre-Purchase Survey - Maple Blvd" created.' },
    { id: 'log-005', timestamp: '2023-02-13T14:30:00Z', userId: 'usr-insp1', userName: 'John Inspector', action: 'SUBMIT_REPORT', entityType: 'REPORT', entityId: 'rpt-002', details: 'Report rpt-002 submitted for review for insp-002.' },
    { id: 'log-006', timestamp: '2023-02-04T11:00:00Z', userId: 'usr-mngr1', userName: 'Jane Manager', action: 'REJECT_REPORT', entityType: 'REPORT', entityId: 'rpt-004', details: 'Report rpt-004 rejected for insp-006. Manager comments: "Missing compliance details."' },
    { id: 'log-007', timestamp: '2023-01-09T10:00:00Z', userId: 'usr-mngr1', userName: 'Jane Manager', action: 'APPROVE_REPORT', entityType: 'REPORT', entityId: 'rpt-001', details: 'Report rpt-001 approved for insp-001.' },
    { id: 'log-008', timestamp: '2023-01-25T09:00:00Z', userId: 'usr-insp2', userName: 'Alice Inspector', action: 'UPDATE_INSPECTION_STATUS', entityType: 'INSPECTION', entityId: 'insp-004', details: 'Inspection insp-004 status changed to OVERDUE by system.' },
    { id: 'log-009', timestamp: '2023-03-08T09:00:00Z', userId: 'usr-insp2', userName: 'Alice Inspector', action: 'SUBMIT_REPORT', entityType: 'REPORT', entityId: 'rpt-007', details: 'Report rpt-007 submitted for review for insp-010.' },
    { id: 'log-010', timestamp: '2023-03-02T11:00:00Z', userId: 'usr-insp2', userName: 'Alice Inspector', action: 'UPDATE_INSPECTION_STATUS', entityType: 'INSPECTION', entityId: 'insp-003', details: 'Inspection insp-003 status changed to IN_PROGRESS.' },
    { id: 'log-011', timestamp: '2023-01-13T16:00:00Z', userId: 'usr-admin', userName: 'Admin User', action: 'CLOSE_INSPECTION', entityType: 'INSPECTION', entityId: 'insp-008', details: 'Inspection insp-008 closed.' },
    { id: 'log-012', timestamp: '2023-03-07T15:00:00Z', userId: 'usr-mngr1', userName: 'Jane Manager', action: 'APPROVE_REPORT', entityType: 'REPORT', entityId: 'rpt-007', details: 'Report rpt-007 approved for insp-010.' },
];

const statusColors = {
    APPROVED: '#28a745', COMPLETED: '#28a745', CLOSED: '#28a745',
    IN_PROGRESS: '#007bff', ASSIGNED: '#007bff', SCHEDULED: '#007bff',
    PENDING: '#ffc107', 'ACTION REQUIRED': '#ffc107', PENDING_REVIEW: '#ffc107',
    REJECTED: '#dc3545', 'SLA BREACH': '#dc3545', OVERDUE: '#dc3545',
    EXCEPTION: '#6f42c1', ESCALATION: '#6f42c1',
    DRAFT: '#6c757d', ARCHIVED: '#6c757d',
    SUBMITTED: '#6f42c1', REVIEWED: '#007bff',
};

// --- RBAC DEFINITIONS ---
const userRoles = {
    ADMIN: {
        can: {
            viewDashboard: true,
            viewInspections: true, createInspection: true, editInspection: true, deleteInspection: true, approveInspection: true,
            viewReports: true, createReport: true, editReport: true, deleteReport: true, approveReport: true,
            viewUsers: true, createUser: true, editUser: true, deleteUser: true,
            viewAuditLogs: true,
            viewAllData: true,
            exportData: true,
            accessSettings: true,
        },
    },
    MANAGER: {
        can: {
            viewDashboard: true,
            viewInspections: true, createInspection: true, editInspection: true, approveInspection: true,
            viewReports: true, viewReportsAssignedToTeam: true, editReport: true, approveReport: true,
            viewAuditLogs: true,
            exportData: true,
        },
        scope: { type: 'TEAM', field: 'teamId' }, // Managers see inspections within their team
    },
    INSPECTOR: {
        can: {
            viewDashboard: true,
            viewInspections: true, createReport: true, editReport: true, uploadDocuments: true,
            viewReports: true, viewReportsAssignedToMe: true,
        },
        scope: { type: 'ASSIGNED', field: 'inspectorId' }, // Inspectors see inspections assigned to them
    },
    CLIENT: {
        can: {
            viewDashboard: true,
            viewInspections: true, viewReports: true, viewDocuments: true,
        },
        scope: { type: 'CLIENT', field: 'clientId' }, // Clients see inspections related to their client ID
    },
};

// --- HELPER FUNCTIONS ---
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

// --- CORE COMPONENTS ---

const NotificationToast = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000); // Auto-close after 3 seconds
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`toast ${type}`}>
            {type === 'success' && <FaCheckCircle />}
            {type === 'error' && <FaTimesCircle />}
            {type === 'info' && <FaBell />}
            <span>{message}</span>
        </div>
    );
};

const EmptyState = ({ title, message, actionText, onAction, icon: Icon }) => (
    <div className="empty-state">
        {Icon && <Icon />}
        <h3>{title}</h3>
        <p>{message}</p>
        {actionText && onAction && (
            <button className="btn btn-primary" onClick={onAction}>
                <FaPlus /> {actionText}
            </button>
        )}
    </div>
);

const CardComponent = ({ title, subTitle, status, details, onClick, footerText, accentColor, children }) => {
    const statusClass = status ? `status-${status.toLowerCase().replace(/ /g, '_')}` : '';
    const headerColor = statusColors[status.toUpperCase()] || accentColor || 'var(--primary-color)';
    const backgroundTint = status ? `${statusColors[status.toUpperCase()]}10` : 'var(--secondary-color)'; // 10% opacity

    return (
        <div
            className={`card ${statusClass}`}
            onClick={onClick}
            style={{ '--accent-border-color': headerColor, backgroundColor: backgroundTint }}
        >
            <div className="card-header" style={{ backgroundColor: headerColor }}>
                <span className="card-title">{title}</span>
                {status && <span className="card-status-badge">{status.replace(/_/g, ' ')}</span>}
            </div>
            <div className="card-content">
                {subTitle && <p className="text-muted" style={{ marginBottom: 'var(--spacing-sm)' }}>{subTitle}</p>}
                {details.map((item, index) => (
                    <p key={index} style={{ fontSize: 'var(--font-size-sm)', color: '#555' }}>
                        <strong>{item.label}:</strong> {item.value}
                    </p>
                ))}
                {children}
            </div>
            {footerText && <div className="card-footer">{footerText}</div>}
        </div>
    );
};

const KPIWidget = ({ title, value, change, color, realtime = false }) => (
    <div className={`kpi-widget ${realtime ? 'realtime' : ''}`} style={{ borderLeftColor: color }}>
        <p className="title">{title}</p>
        <p className="value">{value}</p>
        {change && <p className="change">{change}</p>}
    </div>
);

const ChartComponent = ({ type, title, data }) => (
    <div className="chart-container">
        <h3>{title}</h3>
        <div className="chart-placeholder">
            {type === 'Bar' && 'Bar Chart Placeholder'}
            {type === 'Line' && 'Line Chart Placeholder'}
            {type === 'Donut' && 'Donut Chart Placeholder'}
            {type === 'Gauge' && 'Gauge Chart Placeholder'}
            <br />
            (Using data: {JSON.stringify(data)})
        </div>
    </div>
);

const WorkflowTracker = ({ workflowHistory, currentWorkflowStage, slaStatus }) => {
    const allStages = ['DRAFT', 'SCHEDULED', 'ASSIGNED', 'IN_PROGRESS', 'PENDING_REVIEW', 'APPROVED', 'CLOSED'];

    return (
        <div className="workflow-tracker">
            {allStages.map((stage, index) => {
                const isCompleted = workflowHistory.some(h => h.stage === stage) && stage !== currentWorkflowStage;
                const isActive = stage === currentWorkflowStage;
                const isBreached = slaStatus === 'BREACHED' && isActive;
                return (
                    <div
                        key={stage}
                        className={`workflow-stage ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''} ${isBreached ? 'breached' : ''}`}
                    >
                        <div className="workflow-stage-dot"></div>
                        <p>{stage.replace(/_/g, ' ')}</p>
                        {index < allStages.length - 1 && <div className="workflow-stage-line"></div>}
                    </div>
                );
            })}
        </div>
    );
};

// --- AUTHENTICATION & RBAC ---
const LoginScreen = ({ onLogin }) => {
    const [selectedRole, setSelectedRole] = useState('ADMIN');

    return (
        <div className="full-screen-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 'var(--spacing-xl)' }}>
            <h1 style={{ color: 'var(--primary-color)' }}>PropTrack Login</h1>
            <div className="form-container" style={{ width: '400px' }}>
                <div className="form-group">
                    <label htmlFor="role-select">Select Role:</label>
                    <select
                        id="role-select"
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                    >
                        {usersData.map((u) => (
                            <option key={u.id} value={u.role}>
                                {u.name} ({u.role})
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-actions" style={{ borderTop: 'none' }}>
                    <button className="btn btn-primary" onClick={() => onLogin(usersData.find(u => u.role === selectedRole))}>
                        Login
                    </button>
                </div>
            </div>
        </div>
    );
};

const Header = ({ currentUser, onLogout, navigate, toggleSidebar, isSidebarOpen }) => {
    return (
        <header className="header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                <button onClick={toggleSidebar} style={{ fontSize: 'var(--font-size-xl)' }}>
                    <FaBars />
                </button>
                <div className="logo" onClick={() => navigate('Dashboard')}>PropTrack</div>
            </div>
            <div className="search-bar-container">
                <FaSearch className="search-icon" />
                <input type="text" placeholder="Global search..." />
            </div>
            <div className="header-actions">
                <button><FaBell /></button>
                <div className="user-profile">
                    <FaUserCircle />
                    <span>{currentUser.name} ({currentUser.role})</span>
                </div>
                <button className="btn btn-text" onClick={onLogout}>Logout</button>
            </div>
        </header>
    );
};

const Sidebar = ({ currentUser, navigate, currentScreen }) => {
    const canAccess = (feature) => userRoles[currentUser.role]?.can[feature];

    return (
        <aside className="sidebar">
            <nav className="sidebar-nav">
                <ul>
                    {canAccess('viewDashboard') && (
                        <li className="sidebar-nav-item">
                            <button onClick={() => navigate('Dashboard')} className={currentScreen.name === 'Dashboard' ? 'active' : ''}>
                                <FaChartLine /> Dashboard
                            </button>
                        </li>
                    )}
                    {canAccess('viewInspections') && (
                        <li className="sidebar-nav-item">
                            <button onClick={() => navigate('InspectionsList')} className={currentScreen.name === 'InspectionsList' ? 'active' : ''}>
                                <FaClipboardList /> Inspections
                            </button>
                        </li>
                    )}
                    {canAccess('viewReports') && (
                        <li className="sidebar-nav-item">
                            <button onClick={() => navigate('ReportsList')} className={currentScreen.name === 'ReportsList' ? 'active' : ''}>
                                <HiOutlineDocumentText /> Reports
                            </button>
                        </li>
                    )}
                    {canAccess('viewUsers') && (
                        <li className="sidebar-nav-item">
                            <button onClick={() => navigate('UserManagement')} className={currentScreen.name === 'UserManagement' ? 'active' : ''}>
                                <FaUsers /> Users
                            </button>
                        </li>
                    )}
                    {canAccess('viewAuditLogs') && (
                        <li className="sidebar-nav-item">
                            <button onClick={() => navigate('AuditLogs')} className={currentScreen.name === 'AuditLogs' ? 'active' : ''}>
                                <FaHistory /> Audit Logs
                            </button>
                        </li>
                    )}
                </ul>
            </nav>
        </aside>
    );
};

// --- SCREENS ---

const Dashboard = ({ currentUser, inspections, reports, navigate, hasAccess }) => {
    const filteredInspections = inspections.filter(insp => {
        if (currentUser.role === 'ADMIN') return true;
        if (currentUser.role === 'CLIENT') return insp.clientId === currentUser.clientId;
        if (currentUser.role === 'INSPECTOR') return insp.inspectorId === currentUser.id;
        if (currentUser.role === 'MANAGER') return insp.teamId === currentUser.teamId; // Assuming teamId for inspections
        return false;
    });

    const totalInspections = filteredInspections.length;
    const completedInspections = filteredInspections.filter(i => i.status === 'APPROVED' || i.status === 'CLOSED').length;
    const pendingReviewInspections = filteredInspections.filter(i => i.status === 'PENDING_REVIEW').length;
    const overdueInspections = filteredInspections.filter(i => i.status === 'OVERDUE' || i.slaStatus === 'BREACHED').length;

    const recentActivities = auditLogsData
        .filter(log => {
            if (currentUser.role === 'ADMIN') return true;
            if (currentUser.role === 'CLIENT') {
                const inspection = inspections.find(i => i.id === log.entityId);
                return inspection?.clientId === currentUser.clientId;
            }
            if (currentUser.role === 'INSPECTOR') return log.userId === currentUser.id || inspections.find(i => i.id === log.entityId)?.inspectorId === currentUser.id;
            if (currentUser.role === 'MANAGER') {
                const teamInspections = inspections.filter(i => i.teamId === currentUser.teamId); // Assuming teamId on inspections
                return teamInspections.some(i => i.id === log.entityId) || log.userId === currentUser.id;
            }
            return false;
        })
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 5);

    return (
        <div style={{ padding: 'var(--spacing-xl)' }}>
            <h1 style={{ marginBottom: 'var(--spacing-lg)' }}>Dashboard for {currentUser.name}</h1>

            <div className="kpi-grid">
                <KPIWidget title="Total Inspections" value={totalInspections} color="var(--primary-color)" realtime />
                <KPIWidget title="Completed" value={completedInspections} change={`+${Math.floor(Math.random() * 5)} last week`} color="var(--color-status-approved)" />
                <KPIWidget title="Pending Review" value={pendingReviewInspections} color="var(--color-status-pending)" />
                <KPIWidget title="Overdue" value={overdueInspections} color="var(--color-status-rejected)" realtime />
            </div>

            <h2 style={{ marginBottom: 'var(--spacing-md)', color: 'var(--primary-color)' }}>Inspection Status Breakdown</h2>
            <div className="chart-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--spacing-md)' }}>
                <ChartComponent type="Donut" title="Overall Status" data={[]} />
                <ChartComponent type="Bar" title="Inspections by Inspector" data={[]} />
            </div>

            <h2 style={{ marginBottom: 'var(--spacing-md)', marginTop: 'var(--spacing-xl)', color: 'var(--primary-color)' }}>Recent Activities</h2>
            <div className="detail-section" style={{ padding: 0 }}>
                {recentActivities.length > 0 ? (
                    recentActivities.map(log => (
                        <div key={log.id} className="audit-log-entry">
                            <span>{formatDateTime(log.timestamp)}</span>
                            <span><strong>{log.userName}</strong>: {log.details}</span>
                            <span><FaEye onClick={() => navigate('AuditLogs', log.id)} className="btn-text" /></span>
                        </div>
                    ))
                ) : (
                    <p style={{ padding: 'var(--spacing-md)', textAlign: 'center' }}>No recent activities.</p>
                )}
            </div>
        </div>
    );
};

const InspectionsList = ({ currentUser, inspections, navigate, hasAccess, showToast }) => {
    const filteredInspections = inspections.filter(insp => {
        if (currentUser.role === 'ADMIN') return true;
        if (currentUser.role === 'CLIENT') return insp.clientId === currentUser.clientId;
        if (currentUser.role === 'INSPECTOR') return insp.inspectorId === currentUser.id;
        if (currentUser.role === 'MANAGER') {
            // Managers can view inspections assigned to inspectors within their team
            const assignedInspector = usersData.find(u => u.id === insp.inspectorId);
            return assignedInspector && assignedInspector.teamId === currentUser.teamId;
        }
        return false;
    });

    const handleCreateInspection = () => {
        if (hasAccess('createInspection')) {
            navigate('InspectionForm', 'new');
        } else {
            showToast('You do not have permission to create inspections.', 'error');
        }
    };

    return (
        <div style={{ padding: 'var(--spacing-xl)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
                <h1 style={{ marginBottom: '0' }}>Inspections</h1>
                {hasAccess('createInspection') && (
                    <button className="btn btn-primary" onClick={handleCreateInspection}>
                        <FaPlus /> Create New Inspection
                    </button>
                )}
            </div>

            {filteredInspections.length > 0 ? (
                <div className="card-grid">
                    {filteredInspections.map(insp => (
                        <CardComponent
                            key={insp.id}
                            title={insp.title}
                            subTitle={`Property: ${insp.propertyAddress}`}
                            status={insp.status}
                            details={[
                                { label: 'Assigned To', value: usersData.find(u => u.id === insp.inspectorId)?.name || 'N/A' },
                                { label: 'Scheduled', value: formatDate(insp.scheduledDate) },
                                { label: 'Status', value: insp.status.replace(/_/g, ' ') },
                                { label: 'SLA Status', value: insp.slaStatus.replace(/_/g, ' ') },
                            ]}
                            footerText={`Last Update: ${formatDate(insp.lastUpdate)}`}
                            onClick={() => navigate('InspectionDetail', insp.id)}
                        />
                    ))}
                </div>
            ) : (
                <EmptyState
                    icon={FaClipboardList}
                    title="No Inspections Yet"
                    message="It looks like there are no inspections here based on your role. Start by creating a new one!"
                    actionText={hasAccess('createInspection') ? "Create First Inspection" : ""}
                    onAction={hasAccess('createInspection') ? handleCreateInspection : null}
                />
            )}
        </div>
    );
};

const InspectionDetail = ({ currentUser, inspections, reports, navigate, goBack, hasAccess, showToast, refreshData }) => {
    const { id: inspectionId } = currentScreen.params;
    const inspection = inspections.find(i => i.id === inspectionId);

    if (!inspection) return <EmptyState icon={FaExclamationTriangle} title="Inspection Not Found" message="The inspection you are looking for does not exist or you do not have access." actionText="Back to Inspections" onAction={() => navigate('InspectionsList')} />;

    const canEdit = hasAccess('editInspection');
    const canApprove = hasAccess('approveInspection') && inspection.status === 'PENDING_REVIEW';
    const canViewReport = hasAccess('viewReports');
    const canCreateReport = hasAccess('createReport') && inspection.status !== 'CLOSED' && inspection.status !== 'APPROVED';
    const canUploadDocuments = hasAccess('uploadDocuments');
    const canViewAuditLogs = hasAccess('viewAuditLogs');

    const [activeTab, setActiveTab] = useState('details');

    const handleApprove = () => {
        if (!canApprove) {
            showToast('You do not have permission to approve this inspection.', 'error');
            return;
        }
        // Simulate approval
        const updatedInspections = inspections.map(insp =>
            insp.id === inspectionId
                ? { ...insp, status: 'APPROVED', currentWorkflowStage: 'APPROVED', workflowHistory: [...insp.workflowHistory, { stage: 'APPROVED', by: currentUser.name, date: new Date().toISOString(), comments: 'Inspection approved.' }] }
                : insp
        );
        refreshData({ inspections: updatedInspections });
        showToast('Inspection approved successfully!', 'success');
        navigate('InspectionsList'); // Go back to list after action
    };

    const handleReject = () => {
        if (!canApprove) { // Using approve permission for reject too for simplicity
            showToast('You do not have permission to reject this inspection.', 'error');
            return;
        }
        // Simulate rejection
        const updatedInspections = inspections.map(insp =>
            insp.id === inspectionId
                ? { ...insp, status: 'REJECTED', currentWorkflowStage: 'REJECTED', workflowHistory: [...insp.workflowHistory, { stage: 'REJECTED', by: currentUser.name, date: new Date().toISOString(), comments: 'Inspection rejected.' }] }
                : insp
        );
        refreshData({ inspections: updatedInspections });
        showToast('Inspection rejected.', 'info');
        navigate('InspectionsList');
    };

    const inspectionReports = reports.filter(rpt => inspection.reports.includes(rpt.id));

    return (
        <div className="full-screen-page">
            <div className="full-screen-page-header">
                <h1>
                    <button className="btn btn-text" onClick={goBack}><FaChevronLeft /></button>
                    {inspection.title} <span className="card-status-badge" style={{ backgroundColor: statusColors[inspection.status.toUpperCase()] }}>{inspection.status.replace(/_/g, ' ')}</span>
                </h1>
                <div className="actions">
                    {canEdit && <button className="btn btn-secondary" onClick={() => navigate('InspectionForm', inspection.id)}><FaEdit /> Edit</button>}
                    {canApprove && (
                        <>
                            <button className="btn btn-primary" onClick={handleApprove}><FaCheckCircle /> Approve</button>
                            <button className="btn btn-danger" onClick={handleReject}><FaTimesCircle /> Reject</button>
                        </>
                    )}
                </div>
            </div>

            <WorkflowTracker workflowHistory={inspection.workflowHistory} currentWorkflowStage={inspection.currentWorkflowStage} slaStatus={inspection.slaStatus} />

            <div className="tabs">
                <button className={`tab-button ${activeTab === 'details' ? 'active' : ''}`} onClick={() => setActiveTab('details')}>Details</button>
                <button className={`tab-button ${activeTab === 'reports' ? 'active' : ''}`} onClick={() => setActiveTab('reports')}>Reports ({inspectionReports.length})</button>
                <button className={`tab-button ${activeTab === 'documents' ? 'active' : ''}`} onClick={() => setActiveTab('documents')}>Documents ({inspection.documents.length})</button>
                {canViewAuditLogs && <button className={`tab-button ${activeTab === 'audit' ? 'active' : ''}`} onClick={() => setActiveTab('audit')}>Audit Log</button>}
            </div>

            <div className="tab-content">
                {activeTab === 'details' && (
                    <div className="detail-section">
                        <h2>Inspection Information</h2>
                        <div className="detail-grid">
                            <div className="detail-item"><label>Property Address</label><p>{inspection.propertyAddress}</p></div>
                            <div className="detail-item"><label>Client</label><p>{clientsData.find(c => c.id === inspection.clientId)?.name || 'N/A'}</p></div>
                            <div className="detail-item"><label>Assigned To</label><p>{usersData.find(u => u.id === inspection.inspectorId)?.name || 'N/A'}</p></div>
                            <div className="detail-item"><label>Scheduled Date</label><p>{formatDate(inspection.scheduledDate)}</p></div>
                            <div className="detail-item"><label>Completion Date</label><p>{formatDate(inspection.completionDate)}</p></div>
                            <div className="detail-item"><label>Priority</label><p>{inspection.priority}</p></div>
                            <div className="detail-item"><label>SLA Status</label><p className={inspection.slaStatus === 'BREACHED' ? 'text-danger' : ''}>{inspection.slaStatus.replace(/_/g, ' ')}</p></div>
                        </div>
                        <h2 style={{ marginTop: 'var(--spacing-xl)' }}>Description</h2>
                        <p>{inspection.description}</p>
                    </div>
                )}

                {activeTab === 'reports' && (
                    <div className="detail-section">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
                            <h2>Associated Reports</h2>
                            {canCreateReport && (
                                <button className="btn btn-primary" onClick={() => navigate('ReportForm', { inspectionId: inspection.id, reportId: 'new' })}>
                                    <FaPlus /> Create Report
                                </button>
                            )}
                        </div>
                        {inspectionReports.length > 0 ? (
                            <div className="card-grid">
                                {inspectionReports.map(rpt => (
                                    <CardComponent
                                        key={rpt.id}
                                        title={`${rpt.type} Report`}
                                        subTitle={`Inspector: ${usersData.find(u => u.id === rpt.inspectorId)?.name || 'N/A'}`}
                                        status={rpt.status}
                                        details={[{ label: 'Submitted On', value: formatDate(rpt.submissionDate) }]}
                                        onClick={() => canViewReport && navigate('ReportDetail', rpt.id)}
                                    >
                                        <p style={{ marginTop: 'var(--spacing-sm)', fontSize: 'var(--font-size-sm)' }}>{rpt.summary}</p>
                                    </CardComponent>
                                ))}
                            </div>
                        ) : (
                            <EmptyState
                                icon={HiOutlineDocumentText}
                                title="No Reports Found"
                                message="There are no reports for this inspection yet."
                                actionText={canCreateReport ? "Create First Report" : ""}
                                onAction={canCreateReport ? () => navigate('ReportForm', { inspectionId: inspection.id, reportId: 'new' }) : null}
                            />
                        )}
                    </div>
                )}

                {activeTab === 'documents' && (
                    <div className="detail-section">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
                            <h2>Documents</h2>
                            {canUploadDocuments && (
                                <button className="btn btn-primary"><FaFileUpload /> Upload Document</button>
                            )}
                        </div>
                        {inspection.documents && inspection.documents.length > 0 ? (
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {inspection.documents.map(doc => (
                                    <li key={doc.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--spacing-sm) 0', borderBottom: '1px solid var(--border-color)' }}>
                                        <span><FaFileAlt style={{ marginRight: 'var(--spacing-sm)' }} /> {doc.name}</span>
                                        <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                                            <a href={doc.url} target="_blank" rel="noopener noreferrer" className="btn btn-text"><FaEye /> View</a>
                                            <button className="btn btn-text"><FaDownload /> Download</button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <EmptyState
                                icon={FaFileAlt}
                                title="No Documents"
                                message="No supporting documents have been uploaded for this inspection."
                                actionText={canUploadDocuments ? "Upload First Document" : ""}
                                onAction={canUploadDocuments ? () => showToast("Simulating document upload...", "info") : null}
                            />
                        )}
                    </div>
                )}

                {activeTab === 'audit' && canViewAuditLogs && (
                    <div className="detail-section">
                        <h2>Audit Log for Inspection</h2>
                        {auditLogsData
                            .filter(log => log.entityType === 'INSPECTION' && log.entityId === inspection.id)
                            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                            .map(log => (
                                <div key={log.id} className="audit-log-entry">
                                    <span>{formatDateTime(log.timestamp)}</span>
                                    <span><strong>{log.userName}</strong>: {log.details}</span>
                                </div>
                            ))
                        }
                    </div>
                )}
            </div>
        </div>
    );
};

const InspectionForm = ({ currentUser, inspections, navigate, goBack, hasAccess, showToast, refreshData, currentScreen }) => {
    const { id: inspectionId } = currentScreen.params;
    const isNew = inspectionId === 'new';
    const existingInspection = inspections.find(i => i.id === inspectionId);

    const [formData, setFormData] = useState({
        title: '',
        propertyId: '',
        clientId: '',
        inspectorId: '',
        scheduledDate: '',
        priority: 'MEDIUM',
        description: '',
        ...existingInspection,
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (!isNew && existingInspection) {
            setFormData(existingInspection);
        } else if (isNew) {
            setFormData({
                id: generateUniqueId('insp'),
                title: '',
                propertyId: '',
                clientId: '',
                inspectorId: '',
                scheduledDate: '',
                priority: 'MEDIUM',
                description: '',
                status: 'DRAFT',
                currentWorkflowStage: 'DRAFT',
                workflowHistory: [{ stage: 'DRAFT', by: currentUser.name, date: new Date().toISOString(), comments: 'Inspection created.' }],
                slaStatus: 'ON_TRACK',
                reports: [],
                documents: [],
                assignedDate: null,
                completionDate: null,
                lastUpdate: new Date().toISOString(),
            });
        }
    }, [inspectionId, isNew, existingInspection, currentUser.name]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: '' })); // Clear error on change
    };

    const validateForm = () => {
        let newErrors = {};
        if (!formData.title) newErrors.title = 'Title is required.';
        if (!formData.propertyId) newErrors.propertyId = 'Property is required.';
        if (!formData.clientId) newErrors.clientId = 'Client is required.';
        if (!formData.inspectorId) newErrors.inspectorId = 'Inspector is required.';
        if (!formData.scheduledDate) newErrors.scheduledDate = 'Scheduled Date is required.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) {
            showToast('Please correct the form errors.', 'error');
            return;
        }

        const newInspectionData = {
            ...formData,
            propertyAddress: propertiesData.find(p => p.id === formData.propertyId)?.address,
            lastUpdate: new Date().toISOString(),
        };

        let updatedInspections;
        if (isNew) {
            if (!hasAccess('createInspection')) {
                showToast('You do not have permission to create inspections.', 'error');
                return;
            }
            updatedInspections = [...inspections, newInspectionData];
            showToast('Inspection created successfully!', 'success');
        } else {
            if (!hasAccess('editInspection')) {
                showToast('You do not have permission to edit inspections.', 'error');
                return;
            }
            updatedInspections = inspections.map(insp =>
                insp.id === inspectionId ? newInspectionData : insp
            );
            showToast('Inspection updated successfully!', 'success');
        }
        refreshData({ inspections: updatedInspections });
        navigate('InspectionsList');
    };

    if (!isNew && !existingInspection) return <EmptyState icon={FaExclamationTriangle} title="Inspection Not Found" message="The inspection you are trying to edit does not exist." actionText="Back to Inspections" onAction={() => navigate('InspectionsList')} />;
    if (isNew && !hasAccess('createInspection')) return <EmptyState icon={FaExclamationTriangle} title="Access Denied" message="You do not have permission to create new inspections." actionText="Back to Dashboard" onAction={() => navigate('Dashboard')} />;
    if (!isNew && !hasAccess('editInspection')) return <EmptyState icon={FaExclamationTriangle} title="Access Denied" message="You do not have permission to edit this inspection." actionText="Back to Detail" onAction={() => navigate('InspectionDetail', inspectionId)} />;


    const availableProperties = propertiesData.filter(p => !formData.clientId || p.clientId === formData.clientId);
    const availableInspectors = usersData.filter(u => u.role === 'INSPECTOR');


    return (
        <div className="full-screen-page">
            <div className="full-screen-page-header">
                <h1>
                    <button className="btn btn-text" onClick={goBack}><FaChevronLeft /></button>
                    {isNew ? 'Create New Inspection' : `Edit Inspection: ${formData.title}`}
                </h1>
                <div className="actions">
                    <button className="btn btn-primary" onClick={handleSubmit}><FaSave /> Save Inspection</button>
                    <button className="btn btn-secondary" onClick={goBack}>Cancel</button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="form-container">
                <div className="detail-grid"> {/* Using detail-grid for a 2-column layout */}
                    <div className={`form-group ${errors.title ? 'error' : ''}`}>
                        <label htmlFor="title">Title <span style={{ color: 'red' }}>*</span></label>
                        <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required />
                        {errors.title && <p className="form-error-message">{errors.title}</p>}
                    </div>

                    <div className={`form-group ${errors.clientId ? 'error' : ''}`}>
                        <label htmlFor="clientId">Client <span style={{ color: 'red' }}>*</span></label>
                        <select id="clientId" name="clientId" value={formData.clientId} onChange={handleChange} required>
                            <option value="">Select a Client</option>
                            {clientsData.map(client => (
                                <option key={client.id} value={client.id}>{client.name}</option>
                            ))}
                        </select>
                        {errors.clientId && <p className="form-error-message">{errors.clientId}</p>}
                    </div>

                    <div className={`form-group ${errors.propertyId ? 'error' : ''}`}>
                        <label htmlFor="propertyId">Property Address <span style={{ color: 'red' }}>*</span></label>
                        <select id="propertyId" name="propertyId" value={formData.propertyId} onChange={handleChange} required>
                            <option value="">Select a Property</option>
                            {availableProperties.map(property => (
                                <option key={property.id} value={property.id}>{property.address}</option>
                            ))}
                        </select>
                        {errors.propertyId && <p className="form-error-message">{errors.propertyId}</p>}
                    </div>

                    <div className={`form-group ${errors.inspectorId ? 'error' : ''}`}>
                        <label htmlFor="inspectorId">Assigned Inspector <span style={{ color: 'red' }}>*</span></label>
                        <select id="inspectorId" name="inspectorId" value={formData.inspectorId} onChange={handleChange} required>
                            <option value="">Select an Inspector</option>
                            {availableInspectors.map(inspector => (
                                <option key={inspector.id} value={inspector.id}>{inspector.name}</option>
                            ))}
                        </select>
                        {errors.inspectorId && <p className="form-error-message">{errors.inspectorId}</p>}
                    </div>

                    <div className={`form-group ${errors.scheduledDate ? 'error' : ''}`}>
                        <label htmlFor="scheduledDate">Scheduled Date <span style={{ color: 'red' }}>*</span></label>
                        <input type="date" id="scheduledDate" name="scheduledDate" value={formData.scheduledDate} onChange={handleChange} required />
                        {errors.scheduledDate && <p className="form-error-message">{errors.scheduledDate}</p>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="priority">Priority</label>
                        <select id="priority" name="priority" value={formData.priority} onChange={handleChange}>
                            <option value="LOW">Low</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="HIGH">High</option>
                            <option value="CRITICAL">Critical</option>
                        </select>
                    </div>
                </div>

                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label htmlFor="description">Description</label>
                    <textarea id="description" name="description" value={formData.description} onChange={handleChange}></textarea>
                </div>
            </form>
        </div>
    );
};

const ReportsList = ({ currentUser, reports, navigate, hasAccess, inspections }) => {
    const filteredReports = reports.filter(report => {
        if (currentUser.role === 'ADMIN') return true;
        const inspection = inspections.find(i => i.id === report.inspectionId);
        if (!inspection) return false;

        if (currentUser.role === 'CLIENT') return inspection.clientId === currentUser.clientId;
        if (currentUser.role === 'INSPECTOR') return report.inspectorId === currentUser.id;
        if (currentUser.role === 'MANAGER') {
            const assignedInspector = usersData.find(u => u.id === report.inspectorId);
            return assignedInspector && assignedInspector.teamId === currentUser.teamId;
        }
        return false;
    });

    return (
        <div style={{ padding: 'var(--spacing-xl)' }}>
            <h1 style={{ marginBottom: 'var(--spacing-lg)' }}>Reports</h1>
            {filteredReports.length > 0 ? (
                <div className="card-grid">
                    {filteredReports.map(report => (
                        <CardComponent
                            key={report.id}
                            title={`${report.type} Report for ${inspections.find(i => i.id === report.inspectionId)?.propertyAddress || 'N/A'}`}
                            subTitle={`Inspection ID: ${report.inspectionId}`}
                            status={report.status}
                            details={[
                                { label: 'Inspector', value: usersData.find(u => u.id === report.inspectorId)?.name || 'N/A' },
                                { label: 'Submitted On', value: formatDate(report.submissionDate) },
                            ]}
                            footerText={`Status: ${report.status.replace(/_/g, ' ')}`}
                            onClick={() => navigate('ReportDetail', report.id)}
                        />
                    ))}
                </div>
            ) : (
                <EmptyState icon={HiOutlineDocumentText} title="No Reports Found" message="There are no reports available for your role." />
            )}
        </div>
    );
};

const ReportDetail = ({ currentUser, reports, inspections, navigate, goBack, hasAccess, showToast, refreshData, currentScreen }) => {
    const { id: reportId } = currentScreen.params;
    const report = reports.find(r => r.id === reportId);

    if (!report) return <EmptyState icon={FaExclamationTriangle} title="Report Not Found" message="The report you are looking for does not exist or you do not have access." actionText="Back to Reports" onAction={() => navigate('ReportsList')} />;

    const inspection = inspections.find(i => i.id === report.inspectionId);
    if (!inspection) return <EmptyState icon={FaExclamationTriangle} title="Related Inspection Not Found" message="The related inspection could not be found." actionText="Back to Reports" onAction={() => navigate('ReportsList')} />;

    const canEdit = hasAccess('editReport') && (report.status === 'DRAFT' || report.status === 'SUBMITTED');
    const canApprove = hasAccess('approveReport') && report.status === 'SUBMITTED';

    const handleApprove = () => {
        if (!canApprove) {
            showToast('You do not have permission to approve this report.', 'error');
            return;
        }
        const updatedReports = reports.map(r => r.id === reportId ? { ...r, status: 'APPROVED' } : r);
        refreshData({ reports: updatedReports });
        showToast('Report approved successfully!', 'success');
        navigate('ReportsList');
    };

    const handleReject = () => {
        if (!canApprove) { // Using approve permission for reject too for simplicity
            showToast('You do not have permission to reject this report.', 'error');
            return;
        }
        const updatedReports = reports.map(r => r.id === reportId ? { ...r, status: 'REJECTED' } : r);
        refreshData({ reports: updatedReports });
        showToast('Report rejected.', 'info');
        navigate('ReportsList');
    };

    return (
        <div className="full-screen-page">
            <div className="full-screen-page-header">
                <h1>
                    <button className="btn btn-text" onClick={goBack}><FaChevronLeft /></button>
                    {report.type} Report: {inspection.title} <span className="card-status-badge" style={{ backgroundColor: statusColors[report.status.toUpperCase()] }}>{report.status.replace(/_/g, ' ')}</span>
                </h1>
                <div className="actions">
                    {canEdit && <button className="btn btn-secondary" onClick={() => navigate('ReportForm', { inspectionId: inspection.id, reportId: report.id })}><FaEdit /> Edit</button>}
                    {canApprove && (
                        <>
                            <button className="btn btn-primary" onClick={handleApprove}><FaCheckCircle /> Approve</button>
                            <button className="btn btn-danger" onClick={handleReject}><FaTimesCircle /> Reject</button>
                        </>
                    )}
                    <button className="btn btn-secondary"><FaPrint /> Print</button>
                    <button className="btn btn-secondary"><FaDownload /> Export PDF</button>
                </div>
            </div>

            <div className="detail-section">
                <h2>Report Summary</h2>
                <div className="detail-grid">
                    <div className="detail-item"><label>Inspection ID</label><p onClick={() => navigate('InspectionDetail', inspection.id)} className="btn-text">{inspection.id}</p></div>
                    <div className="detail-item"><label>Property</label><p>{inspection.propertyAddress}</p></div>
                    <div className="detail-item"><label>Inspector</label><p>{usersData.find(u => u.id === report.inspectorId)?.name || 'N/A'}</p></div>
                    <div className="detail-item"><label>Submission Date</label><p>{formatDateTime(report.submissionDate)}</p></div>
                </div>
                <h2 style={{ marginTop: 'var(--spacing-xl)' }}>Overall Summary</h2>
                <p>{report.summary}</p>

                <h2 style={{ marginTop: 'var(--spacing-xl)' }}>Findings</h2>
                <ul style={{ listStyleType: 'disc', marginLeft: 'var(--spacing-xl)' }}>
                    {report.findings.length > 0 ? report.findings.map((f, i) => <li key={i}>{f}</li>) : <li>No specific findings documented.</li>}
                </ul>

                <h2 style={{ marginTop: 'var(--spacing-xl)' }}>Recommendations</h2>
                <ul style={{ listStyleType: 'disc', marginLeft: 'var(--spacing-xl)' }}>
                    {report.recommendations.length > 0 ? report.recommendations.map((r, i) => <li key={i}>{r}</li>) : <li>No specific recommendations provided.</li>}
                </ul>

                <h2 style={{ marginTop: 'var(--spacing-xl)' }}>Images</h2>
                {report.images && report.images.length > 0 ? (
                    <div style={{ display: 'flex', gap: 'var(--spacing-md)', flexWrap: 'wrap' }}>
                        {report.images.map((img, index) => (
                            <img key={index} src={img} alt={`Report ${reportId} - Image ${index + 1}`} style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: 'var(--border-radius-sm)' }} />
                        ))}
                    </div>
                ) : (
                    <p>No images uploaded for this report.</p>
                )}
            </div>
        </div>
    );
};

const ReportForm = ({ currentUser, reports, inspections, navigate, goBack, hasAccess, showToast, refreshData, currentScreen }) => {
    const { inspectionId, reportId } = currentScreen.params;
    const isNew = reportId === 'new';
    const inspection = inspections.find(i => i.id === inspectionId);
    const existingReport = reports.find(r => r.id === reportId);

    const [formData, setFormData] = useState({
        type: 'FINAL',
        summary: '',
        findings: [''],
        recommendations: [''],
        images: [], // array of base64 strings or file objects
        ...existingReport,
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (!isNew && existingReport) {
            setFormData(prev => ({ ...prev, ...existingReport }));
        } else if (isNew) {
            setFormData({
                id: generateUniqueId('rpt'),
                inspectionId: inspectionId,
                type: 'FINAL',
                inspectorId: currentUser.id,
                submissionDate: new Date().toISOString(),
                status: 'DRAFT',
                summary: '',
                findings: [''],
                recommendations: [''],
                images: [],
            });
        }
    }, [reportId, isNew, existingReport, inspectionId, currentUser.id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleArrayChange = (field, index, value) => {
        const newArray = [...formData[field]];
        newArray[index] = value;
        setFormData(prev => ({ ...prev, [field]: newArray }));
    };

    const addArrayItem = (field) => {
        setFormData(prev => ({ ...prev, [field]: [...prev[field], ''] }));
    };

    const removeArrayItem = (field, index) => {
        const newArray = formData[field].filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, [field]: newArray }));
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const newImages = [...formData.images];
        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                newImages.push(reader.result); // Store as Data URL
                setFormData(prev => ({ ...prev, images: newImages }));
            };
            reader.readAsDataURL(file);
        });
    };

    const validateForm = () => {
        let newErrors = {};
        if (!formData.summary) newErrors.summary = 'Report Summary is required.';
        if (!formData.findings[0]) newErrors.findings = 'At least one finding is required.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) {
            showToast('Please correct the form errors.', 'error');
            return;
        }

        const newReportData = {
            ...formData,
            submissionDate: new Date().toISOString(),
            inspectorId: currentUser.id,
            status: 'SUBMITTED', // Always submit new reports for review
            findings: formData.findings.filter(f => f.trim() !== ''),
            recommendations: formData.recommendations.filter(r => r.trim() !== ''),
        };

        let updatedReports;
        let updatedInspections;

        if (isNew) {
            if (!hasAccess('createReport')) {
                showToast('You do not have permission to create reports.', 'error');
                return;
            }
            updatedReports = [...reports, newReportData];
            updatedInspections = inspections.map(insp =>
                insp.id === inspectionId ? { ...insp, reports: [...insp.reports, newReportData.id], status: 'PENDING_REVIEW', currentWorkflowStage: 'PENDING_REVIEW' } : insp
            );
            showToast('Report created and submitted for review!', 'success');
        } else {
            if (!hasAccess('editReport')) {
                showToast('You do not have permission to edit reports.', 'error');
                return;
            }
            updatedReports = reports.map(rpt =>
                rpt.id === reportId ? newReportData : rpt
            );
            updatedInspections = inspections.map(insp =>
                insp.id === inspectionId ? { ...insp, status: 'PENDING_REVIEW', currentWorkflowStage: 'PENDING_REVIEW' } : insp
            );
            showToast('Report updated and re-submitted for review!', 'success');
        }
        refreshData({ reports: updatedReports, inspections: updatedInspections });
        navigate('InspectionDetail', inspectionId); // Go back to inspection detail
    };

    if (!inspection) return <EmptyState icon={FaExclamationTriangle} title="Related Inspection Not Found" message="The inspection for this report does not exist." actionText="Back to Reports" onAction={() => navigate('ReportsList')} />;
    if (!isNew && !existingReport) return <EmptyState icon={FaExclamationTriangle} title="Report Not Found" message="The report you are trying to edit does not exist." actionText="Back to Reports" onAction={() => navigate('ReportsList')} />;
    if (isNew && !hasAccess('createReport')) return <EmptyState icon={FaExclamationTriangle} title="Access Denied" message="You do not have permission to create new reports." actionText="Back to Dashboard" onAction={() => navigate('Dashboard')} />;
    if (!isNew && !hasAccess('editReport')) return <EmptyState icon={FaExclamationTriangle} title="Access Denied" message="You do not have permission to edit this report." actionText="Back to Detail" onAction={() => navigate('ReportDetail', reportId)} />;

    return (
        <div className="full-screen-page">
            <div className="full-screen-page-header">
                <h1>
                    <button className="btn btn-text" onClick={goBack}><FaChevronLeft /></button>
                    {isNew ? `Create Report for ${inspection.title}` : `Edit Report: ${existingReport.type} (${inspection.title})`}
                </h1>
                <div className="actions">
                    <button className="btn btn-primary" onClick={handleSubmit}><FaSave /> Submit Report</button>
                    <button className="btn btn-secondary" onClick={goBack}>Cancel</button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="form-container">
                <div className="detail-grid">
                    <div className="form-group">
                        <label>Inspection</label>
                        <p>{inspection.title} ({inspection.propertyAddress})</p>
                    </div>
                    <div className="form-group">
                        <label>Inspector</label>
                        <p>{currentUser.name}</p>
                    </div>
                    <div className="form-group">
                        <label htmlFor="type">Report Type</label>
                        <select id="type" name="type" value={formData.type} onChange={handleChange}>
                            <option value="INITIAL">Initial</option>
                            <option value="FINAL">Final</option>
                            <option value="ADDENDUM">Addendum</option>
                        </select>
                    </div>
                </div>

                <div className={`form-group ${errors.summary ? 'error' : ''}`} style={{ gridColumn: '1 / -1' }}>
                    <label htmlFor="summary">Report Summary <span style={{ color: 'red' }}>*</span></label>
                    <textarea id="summary" name="summary" value={formData.summary} onChange={handleChange}></textarea>
                    {errors.summary && <p className="form-error-message">{errors.summary}</p>}
                </div>

                <h2 style={{ marginTop: 'var(--spacing-xl)', marginBottom: 'var(--spacing-md)' }}>Findings</h2>
                {formData.findings.map((finding, index) => (
                    <div key={index} style={{ display: 'flex', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-sm)' }}>
                        <input
                            type="text"
                            value={finding}
                            onChange={(e) => handleArrayChange('findings', index, e.target.value)}
                            placeholder={`Finding ${index + 1}`}
                            style={{ flexGrow: 1 }}
                        />
                        {formData.findings.length > 1 && (
                            <button type="button" className="btn btn-danger" onClick={() => removeArrayItem('findings', index)}><FaTrash /></button>
                        )}
                    </div>
                ))}
                <button type="button" className="btn btn-secondary" onClick={() => addArrayItem('findings')} style={{ marginBottom: 'var(--spacing-xl)' }}><FaPlus /> Add Finding</button>
                {errors.findings && <p className="form-error-message">{errors.findings}</p>}


                <h2 style={{ marginTop: 'var(--spacing-xl)', marginBottom: 'var(--spacing-md)' }}>Recommendations</h2>
                {formData.recommendations.map((recommendation, index) => (
                    <div key={index} style={{ display: 'flex', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-sm)' }}>
                        <input
                            type="text"
                            value={recommendation}
                            onChange={(e) => handleArrayChange('recommendations', index, e.target.value)}
                            placeholder={`Recommendation ${index + 1}`}
                            style={{ flexGrow: 1 }}
                        />
                        {formData.recommendations.length > 1 && (
                            <button type="button" className="btn btn-danger" onClick={() => removeArrayItem('recommendations', index)}><FaTrash /></button>
                        )}
                    </div>
                ))}
                <button type="button" className="btn btn-secondary" onClick={() => addArrayItem('recommendations')} style={{ marginBottom: 'var(--spacing-xl)' }}><FaPlus /> Add Recommendation</button>

                <h2 style={{ marginTop: 'var(--spacing-xl)', marginBottom: 'var(--spacing-md)' }}>Images</h2>
                <input type="file" multiple accept="image/*" onChange={handleImageUpload} style={{ marginBottom: 'var(--spacing-md)' }} />
                {formData.images && formData.images.length > 0 && (
                    <div style={{ display: 'flex', gap: 'var(--spacing-md)', flexWrap: 'wrap' }}>
                        {formData.images.map((img, index) => (
                            <img key={index} src={img} alt={`Preview ${index}`} style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: 'var(--border-radius-sm)' }} />
                        ))}
                    </div>
                )}
            </form>
        </div>
    );
};

const UserManagement = ({ currentUser, users, navigate, hasAccess, showToast, refreshData }) => {
    const filteredUsers = users.filter(user => {
        if (currentUser.role === 'ADMIN') return true;
        return false; // Only admin can see all users for management
    });

    const handleCreateUser = () => {
        if (hasAccess('createUser')) {
            navigate('UserForm', 'new');
        } else {
            showToast('You do not have permission to create users.', 'error');
        }
    };

    if (!hasAccess('viewUsers')) {
        return <EmptyState icon={FaExclamationTriangle} title="Access Denied" message="You do not have permission to view user management." actionText="Back to Dashboard" onAction={() => navigate('Dashboard')} />;
    }

    return (
        <div style={{ padding: 'var(--spacing-xl)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
                <h1 style={{ marginBottom: '0' }}>User Management</h1>
                {hasAccess('createUser') && (
                    <button className="btn btn-primary" onClick={handleCreateUser}>
                        <FaPlus /> Add New User
                    </button>
                )}
            </div>

            {filteredUsers.length > 0 ? (
                <div className="card-grid">
                    {filteredUsers.map(user => (
                        <CardComponent
                            key={user.id}
                            title={user.name}
                            subTitle={user.email}
                            status={user.role} // Using role as status for color
                            accentColor={statusColors[user.role.toUpperCase()] || 'var(--primary-color)'}
                            details={[
                                { label: 'Role', value: user.role },
                                { label: 'Team', value: user.teamId || 'N/A' },
                                { label: 'Client', value: clientsData.find(c => c.id === user.clientId)?.name || 'N/A' },
                            ]}
                            onClick={() => navigate('UserForm', user.id)}
                        />
                    ))}
                </div>
            ) : (
                <EmptyState
                    icon={FaUsers}
                    title="No Users to Display"
                    message="There are no users to display or you do not have permission."
                    actionText={hasAccess('createUser') ? "Add First User" : ""}
                    onAction={hasAccess('createUser') ? handleCreateUser : null}
                />
            )}
        </div>
    );
};

const UserForm = ({ currentUser, users, navigate, goBack, hasAccess, showToast, refreshData, currentScreen }) => {
    const { id: userId } = currentScreen.params;
    const isNew = userId === 'new';
    const existingUser = users.find(u => u.id === userId);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'INSPECTOR',
        teamId: '',
        clientId: '',
        ...existingUser,
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (!isNew && existingUser) {
            setFormData(existingUser);
        } else if (isNew) {
            setFormData({
                id: generateUniqueId('usr'),
                name: '',
                email: '',
                role: 'INSPECTOR',
                teamId: '',
                clientId: '',
            });
        }
    }, [userId, isNew, existingUser]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validateForm = () => {
        let newErrors = {};
        if (!formData.name) newErrors.name = 'Name is required.';
        if (!formData.email) newErrors.email = 'Email is required.';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid.';
        if (!formData.role) newErrors.role = 'Role is required.';
        // Add more specific validations based on role, e.g., client ID for clients, team ID for managers/inspectors
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) {
            showToast('Please correct the form errors.', 'error');
            return;
        }

        const newUserData = { ...formData };

        let updatedUsers;
        if (isNew) {
            if (!hasAccess('createUser')) { showToast('You do not have permission.', 'error'); return; }
            updatedUsers = [...users, newUserData];
            showToast('User created successfully!', 'success');
        } else {
            if (!hasAccess('editUser')) { showToast('You do not have permission.', 'error'); return; }
            updatedUsers = users.map(user =>
                user.id === userId ? newUserData : user
            );
            showToast('User updated successfully!', 'success');
        }
        refreshData({ users: updatedUsers });
        navigate('UserManagement');
    };

    if (!hasAccess('viewUsers')) return <EmptyState icon={FaExclamationTriangle} title="Access Denied" message="You do not have permission to manage users." actionText="Back to Dashboard" onAction={() => navigate('Dashboard')} />;
    if (!isNew && !existingUser) return <EmptyState icon={FaExclamationTriangle} title="User Not Found" message="The user you are trying to edit does not exist." actionText="Back to User Management" onAction={() => navigate('UserManagement')} />;
    if (isNew && !hasAccess('createUser')) return <EmptyState icon={FaExclamationTriangle} title="Access Denied" message="You do not have permission to create new users." actionText="Back to User Management" onAction={() => navigate('UserManagement')} />;
    if (!isNew && !hasAccess('editUser')) return <EmptyState icon={FaExclamationTriangle} title="Access Denied" message="You do not have permission to edit this user." actionText="Back to User Management" onAction={() => navigate('UserManagement')} />;


    return (
        <div className="full-screen-page">
            <div className="full-screen-page-header">
                <h1>
                    <button className="btn btn-text" onClick={goBack}><FaChevronLeft /></button>
                    {isNew ? 'Create New User' : `Edit User: ${formData.name}`}
                </h1>
                <div className="actions">
                    <button className="btn btn-primary" onClick={handleSubmit}><FaSave /> Save User</button>
                    <button className="btn btn-secondary" onClick={goBack}>Cancel</button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="form-container">
                <div className="detail-grid">
                    <div className={`form-group ${errors.name ? 'error' : ''}`}>
                        <label htmlFor="name">Name <span style={{ color: 'red' }}>*</span></label>
                        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
                        {errors.name && <p className="form-error-message">{errors.name}</p>}
                    </div>
                    <div className={`form-group ${errors.email ? 'error' : ''}`}>
                        <label htmlFor="email">Email <span style={{ color: 'red' }}>*</span></label>
                        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
                        {errors.email && <p className="form-error-message">{errors.email}</p>}
                    </div>
                    <div className={`form-group ${errors.role ? 'error' : ''}`}>
                        <label htmlFor="role">Role <span style={{ color: 'red' }}>*</span></label>
                        <select id="role" name="role" value={formData.role} onChange={handleChange} required>
                            <option value="ADMIN">Admin</option>
                            <option value="MANAGER">Manager</option>
                            <option value="INSPECTOR">Inspector</option>
                            <option value="CLIENT">Client</option>
                        </select>
                        {errors.role && <p className="form-error-message">{errors.role}</p>}
                    </div>
                    {(formData.role === 'MANAGER' || formData.role === 'INSPECTOR') && (
                        <div className="form-group">
                            <label htmlFor="teamId">Team ID</label>
                            <input type="text" id="teamId" name="teamId" value={formData.teamId} onChange={handleChange} />
                        </div>
                    )}
                    {formData.role === 'CLIENT' && (
                        <div className="form-group">
                            <label htmlFor="clientId">Client ID</label>
                            <input type="text" id="clientId" name="clientId" value={formData.clientId} onChange={handleChange} />
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
};

const AuditLogs = ({ currentUser, auditLogs, navigate, goBack, hasAccess }) => {
    if (!hasAccess('viewAuditLogs')) {
        return <EmptyState icon={FaExclamationTriangle} title="Access Denied" message="You do not have permission to view audit logs." actionText="Back to Dashboard" onAction={() => navigate('Dashboard')} />;
    }

    const filteredAuditLogs = auditLogs.filter(log => {
        if (currentUser.role === 'ADMIN') return true;
        // For Managers/Inspectors, limit to logs related to their scope or actions
        // (This is a simplified filter; full implementation would require more complex entity-to-scope mapping)
        return log.userId === currentUser.id ||
               (currentUser.role === 'MANAGER' && usersData.find(u => u.id === log.userId)?.teamId === currentUser.teamId) ||
               (currentUser.role === 'INSPECTOR' && usersData.find(u => u.id === log.userId)?.id === currentUser.id);
    }).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return (
        <div style={{ padding: 'var(--spacing-xl)' }}>
            <h1 style={{ marginBottom: 'var(--spacing-lg)' }}>Audit Logs</h1>

            <div className="detail-section" style={{ padding: 0 }}>
                {filteredAuditLogs.length > 0 ? (
                    filteredAuditLogs.map(log => (
                        <div key={log.id} className="audit-log-entry">
                            <span>{formatDateTime(log.timestamp)}</span>
                            <span><strong>{log.userName}</strong>: {log.details}</span>
                        </div>
                    ))
                ) : (
                    <EmptyState icon={FaHistory} title="No Audit Logs" message="No audit log entries found for your permissions." />
                )}
            </div>
        </div>
    );
};

// --- MAIN APPLICATION ---
export default function App() {
    const [currentUser, setCurrentUser] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [currentScreen, setCurrentScreen] = useState({ name: 'Dashboard', params: {} });
    const [screenHistory, setScreenHistory] = useState([]);
    const [notifications, setNotifications] = useState([]);

    // --- Global Data State ---
    const [inspections, setInspections] = useState(dummyInspections);
    const [reports, setReports] = useState(dummyReports);
    const [users, setUsers] = useState(usersData);
    const [auditLogs, setAuditLogs] = useState(auditLogsData);

    const refreshData = useCallback((newData) => {
        if (newData.inspections) setInspections(newData.inspections);
        if (newData.reports) setReports(newData.reports);
        if (newData.users) setUsers(newData.users);
        if (newData.auditLogs) setAuditLogs(newData.auditLogs);
    }, []);

    const showToast = useCallback((message, type = 'info') => {
        const id = generateUniqueId('toast');
        setNotifications(prev => [...prev, { id, message, type }]);
    }, []);

    const removeToast = useCallback((id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, []);

    const handleLogin = (user) => {
        setCurrentUser(user);
        navigate('Dashboard');
    };

    const handleLogout = () => {
        setCurrentUser(null);
        setCurrentScreen({ name: 'Login', params: {} });
        setScreenHistory([]);
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const navigate = useCallback((screenName, params = {}) => {
        setScreenHistory(prev => {
            // Prevent adding duplicate screens to history if it's the same screen and ID
            const lastScreen = prev[prev.length - 1];
            if (lastScreen && lastScreen.name === screenName && JSON.stringify(lastScreen.params) === JSON.stringify(params)) {
                return prev;
            }
            return [...prev, currentScreen];
        });
        setCurrentScreen({ name: screenName, params });
    }, [currentScreen]);

    const goBack = useCallback(() => {
        if (screenHistory.length > 0) {
            const previousScreen = screenHistory[screenHistory.length - 1];
            setScreenHistory(prev => prev.slice(0, -1));
            setCurrentScreen(previousScreen);
        } else {
            // Default back to dashboard if history is empty
            setCurrentScreen({ name: 'Dashboard', params: {} });
        }
    }, [screenHistory]);


    const hasAccess = useCallback((permission) => {
        if (!currentUser) return false;
        return userRoles[currentUser.role]?.can[permission] === true;
    }, [currentUser]);

    const renderScreen = () => {
        if (!currentUser) {
            return <LoginScreen onLogin={handleLogin} />;
        }

        const screenProps = {
            currentUser,
            inspections,
            reports,
            users,
            auditLogs,
            navigate,
            goBack,
            hasAccess,
            showToast,
            refreshData,
            currentScreen // Pass currentScreen directly to children to access params
        };

        switch (currentScreen.name) {
            case 'Dashboard':
                return <Dashboard {...screenProps} />;
            case 'InspectionsList':
                return <InspectionsList {...screenProps} />;
            case 'InspectionDetail':
                return <InspectionDetail {...screenProps} />;
            case 'InspectionForm':
                return <InspectionForm {...screenProps} />;
            case 'ReportsList':
                return <ReportsList {...screenProps} />;
            case 'ReportDetail':
                return <ReportDetail {...screenProps} />;
            case 'ReportForm':
                return <ReportForm {...screenProps} />;
            case 'UserManagement':
                return <UserManagement {...screenProps} />;
            case 'UserForm':
                return <UserForm {...screenProps} />;
            case 'AuditLogs':
                return <AuditLogs {...screenProps} />;
            default:
                return <Dashboard {...screenProps} />;
        }
    };

    const isFullScreenMode = ['InspectionDetail', 'InspectionForm', 'ReportDetail', 'ReportForm', 'UserForm'].includes(currentScreen.name);

    return (
        <div className="app-container">
            {currentUser && (
                <>
                    <Header currentUser={currentUser} onLogout={handleLogout} navigate={navigate} toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
                    {!isFullScreenMode && <Sidebar currentUser={currentUser} navigate={navigate} currentScreen={currentScreen} />}
                </>
            )}
            <main className={`main-content ${isFullScreenMode ? 'full-screen-mode' : ''}`}>
                {renderScreen()}
            </main>

            <div className="toast-container">
                {notifications.map(n => (
                    <NotificationToast key={n.id} message={n.message} type={n.type} onClose={() => removeToast(n.id)} />
                ))}
            </div>
        </div>
    );
}
