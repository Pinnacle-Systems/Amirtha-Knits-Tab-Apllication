import React, { useState, useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import {
  useGetLotDetailQuery,
  useUpdateLotDetailMutation,
} from "../redux/services/LotDetailData";
import {
  FiFilter,
  FiRefreshCw,
  FiX,
  FiEdit2,
  FiCheckCircle,
  FiEye,
  FiSearch,
} from "react-icons/fi";
import { MdTableChart, MdGridView } from "react-icons/md";
import { BsThreeDotsVertical, BsCheckCircleFill } from "react-icons/bs";
import "./LotPreparation.css";
import { toast } from "react-hot-toast";
import { useGetContractorDetailQuery } from "../redux/services/LotDetailData";
import { useLanguage } from "../Context/LanguageContext";

// ─── Translations ─────────────────────────────────────────────────────────────
const translations = {
  en: {
    // Search & views
    searchPlaceholder: "Search lots...",
    tableView: "Table View",
    cardView: "Card View",
    filter: "Filter",
    refresh: "Refresh Data",
    lot: "lot",
    lots: "lots",
    // Table & Card headers/labels
    batchNo: "Batch No",
    customer: "Customer",
    process: "Process",
    processName: "Process Name",
    fabric: "Fabric",
    color: "Color",
    route: "Route",
    grnNo: "GRN No",
    qty: "Qty",
    quantity: "Quantity",
    partyDc: "Party Dc",
    status: "Status",
    actions: "Actions",
    viewDetails: "View details",
    complete: "Complete",
    markAllCompleted: "Mark all as completed",
    completed: "Completed",
    inProgress: "In Progress",
    pending: "Pending",
    // Detail view
    allItemsInBatch: "All Items in This Batch",
    contractor: "Contractor",
    remarks: "Remarks",
    editDetails: "Edit Details",
    select: "Select",
    // Filter modal
    filterLots: "Filter Lots",
    filterByBatchNo: "Filter by batch no",
    filterByCustomer: "Filter by customer",
    filterByFabric: "Filter by fabric",
    resetFilters: "Reset Filters",
    applyFilters: "Apply Filters",
    // Empty & Loading & Error states
    loadingData: "Loading lot preparation data...",
    errorLoading: "Error loading data",
    dataFormatError: "Data Format Error",
    retry: "Retry",
    noDataAvailable: "No Lot Preparation data available",
    noLotsMatch: "No lots match your search or filters",
    startByCreating: "Start by creating a new entry",
    tryAdjusting: "Try adjusting your search or filters",
    clearFilters: "Clear Filters",
    // Toast messages
    updatingLotStatus: "Updating lot status...",
    pleaseSelectContractor: "Please select Contractor",
    lotMarkedCompleted: "Lot marked as completed!",
    failedToUpdateLot: "Failed to update lot.",
  },
  ta: {
    searchPlaceholder: "லாட்களைத் தேடுங்கள்...",
    tableView: "அட்டவணைப் பார்வை",
    cardView: "கார்டு பார்வை",
    filter: "வடிகட்டு",
    refresh: "தரவை புதுப்பி",
    lot: "லாட்",
    lots: "லாட்கள்",
    batchNo: "தொகுதி எண்",
    customer: "வாடிக்கையாளர்",
    process: "செயல்முறை",
    processName: "செயல்முறை பெயர்",
    fabric: "துணி",
    color: "நிறம்",
    route: "பாதை",
    grnNo: "GRN எண்",
    qty: "அளவு",
    quantity: "அளவு",
    partyDc: "பார்ட்டி DC",
    status: "நிலை",
    actions: "செயல்கள்",
    viewDetails: "விவரங்களைக் காண்க",
    complete: "முடிக்கவும்",
    markAllCompleted: "அனைத்தையும் முடிந்ததாகக் குறிக்கவும்",
    completed: "முடிந்தது",
    inProgress: "செயலில் உள்ளது",
    pending: "நிலுவையில் உள்ளது",
    allItemsInBatch: "இந்த தொகுதியில் உள்ள அனைத்து உருப்படிகளும்",
    contractor: "ஒப்பந்தக்காரர்",
    remarks: "குறிப்புகள்",
    editDetails: "விவரங்களைத் திருத்தவும்",
    select: "தேர்ந்தெடு",
    filterLots: "லாட்களை வடிகட்டவும்",
    filterByBatchNo: "தொகுதி எண் மூலம் வடிகட்டவும்",
    filterByCustomer: "வாடிக்கையாளர் மூலம் வடிகட்டவும்",
    filterByFabric: "துணி மூலம் வடிகட்டவும்",
    resetFilters: "வடிகட்டிகளை மீட்டமை",
    applyFilters: "வடிகட்டிகளைப் பயன்படுத்து",
    loadingData: "லாட் தயாரிப்பு தரவு ஏற்றப்படுகிறது...",
    errorLoading: "தரவை ஏற்றுவதில் பிழை",
    dataFormatError: "தரவு வடிவமைப்பு பிழை",
    retry: "மீண்டும் முயற்சி செய்",
    noDataAvailable: "லாட் தயாரிப்பு தரவு எதுவும் கிடைக்கவில்லை",
    noLotsMatch: "உங்கள் தேடல் அல்லது வடிகட்டிகளுக்கு பொருந்தும் லாட்கள் இல்லை",
    startByCreating: "புதிய பதிவை உருவாக்குவதன் மூலம் தொடங்கவும்",
    tryAdjusting: "உங்கள் தேடல் அல்லது வடிகட்டிகளை மாற்ற முயற்சிக்கவும்",
    clearFilters: "வடிகட்டிகளை அழிக்கவும்",
    updatingLotStatus: "லாட் நிலை புதுப்பிக்கப்படுகிறது...",
    pleaseSelectContractor: "தயவுசெய்து ஒப்பந்தக்காரரைத் தேர்ந்தெடுக்கவும்",
    lotMarkedCompleted: "லாட் முடிந்ததாகக் குறிக்கப்பட்டது!",
    failedToUpdateLot: "லாட்டைப் புதுப்பிக்க முடியவில்லை.",
  },
  hi: {
    searchPlaceholder: "लॉट खोजें...",
    tableView: "तालिका दृश्य",
    cardView: "कार्ड दृश्य",
    filter: "फ़िल्टर",
    refresh: "डेटा रीफ़्रेश करें",
    lot: "लॉट",
    lots: "लॉट",
    batchNo: "बैच नं.",
    customer: "ग्राहक",
    process: "प्रक्रिया",
    processName: "प्रक्रिया का नाम",
    fabric: "कपड़ा",
    color: "रंग",
    route: "मार्ग",
    grnNo: "GRN नं.",
    qty: "मात्रा",
    quantity: "मात्रा",
    partyDc: "पार्टी DC",
    status: "स्थिति",
    actions: "कार्रवाई",
    viewDetails: "विवरण देखें",
    complete: "पूर्ण करें",
    markAllCompleted: "सभी को पूर्ण चिह्नित करें",
    completed: "पूर्ण",
    inProgress: "प्रगति पर है",
    pending: "लंबित",
    allItemsInBatch: "इस बैच के सभी आइटम",
    contractor: "ठेकेदार",
    remarks: "टिप्पणियाँ",
    editDetails: "विवरण संपादित करें",
    select: "चुनें",
    filterLots: "लॉट फ़िल्टर करें",
    filterByBatchNo: "बैच नंबर से फ़िल्टर करें",
    filterByCustomer: "ग्राहक द्वारा फ़िल्टर करें",
    filterByFabric: "कपड़े से फ़िल्टर करें",
    resetFilters: "फ़िल्टर रीसेट करें",
    applyFilters: "फ़िल्टर लागू करें",
    loadingData: "लॉट तैयारी डेटा लोड हो रहा है...",
    errorLoading: "डेटा लोड करने में त्रुटि",
    dataFormatError: "डेटा प्रारूप त्रुटि",
    retry: "पुनः प्रयास करें",
    noDataAvailable: "कोई लॉट तैयारी डेटा उपलब्ध नहीं है",
    noLotsMatch: "कोई लॉट आपकी खोज या फ़िल्टर से मेल नहीं खाता",
    startByCreating: "नई प्रविष्टि बनाकर शुरू करें",
    tryAdjusting: "अपनी खोज या फ़िल्टर समायोजित करने का प्रयास करें",
    clearFilters: "फ़िल्टर साफ़ करें",
    updatingLotStatus: "लॉट स्थिति अपडेट हो रही है...",
    pleaseSelectContractor: "कृपया ठेकेदार का चयन करें",
    lotMarkedCompleted: "लॉट पूर्ण के रूप में चिह्नित!",
    failedToUpdateLot: "लॉट अपडेट करने में विफल।",
  },
};

const LotPreparation = () => {
  const { lang } = useLanguage();
  const t = translations[lang] ?? translations["en"];

  const isMobile = useMediaQuery({ maxWidth: 768 });
  const [viewMode, setViewMode] = useState(isMobile ? "cards" : "table");
  const [selectedLot, setSelectedLot] = useState(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showActionsMenu, setShowActionsMenu] = useState(null);
  const [selectedContractor, setSelectedContractor] = useState("");

  const filtersInitialState = {
    batchNo: "",
    customer: "",
    fabric: "",
    dateFrom: "",
    dateTo: "",
    status: "",
  };
  const DropdownField = ({
    label,
    value,
    options = [],
    valueKey,
    onChange,
  }) => (
    <div className="flex flex-col">
      <label className="text-sm text-gray-600 mb-1">{label}</label>
      <select
        className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#2BA94C] text-sm"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">{t.select} {label}</option>
        {options.map((item, idx) => (
          <option key={idx} value={item[valueKey]}>
            {item[valueKey]}
          </option>
        ))}
      </select>
    </div>
  );

  const [filters, setFilters] = useState(filtersInitialState);

  const {
    data: apiResponse,
    error,
    isLoading,
    refetch,
  } = useGetLotDetailQuery();
  const { data: contractDet } = useGetContractorDetailQuery();
  const Contractor = contractDet?.data;
  const [updateLot] = useUpdateLotDetailMutation();
  console.log(apiResponse?.data, "apiResponse");
  const filteredData =
    apiResponse?.statusCode === 0
      ? (apiResponse.data || []).filter((lot) => {
          const matchesSearch =
            !searchQuery ||
            lot?.BATCHNO?.toLowerCase?.().includes(searchQuery.toLowerCase()) ||
            lot?.CUSTNAME?.toLowerCase?.().includes(
              searchQuery.toLowerCase(),
            ) ||
            lot?.FABRIC?.toLowerCase?.().includes(searchQuery.toLowerCase());

          const batchNoMatch =
            !filters.batchNo ||
            lot?.BATCHNO?.toLowerCase?.().includes(
              filters.batchNo.toLowerCase(),
            );
          const customerMatch =
            !filters.customer ||
            lot?.CUSTNAME?.toLowerCase?.().includes(
              filters.customer.toLowerCase(),
            );
          const fabricMatch =
            !filters.fabric ||
            lot?.FABRIC?.toLowerCase?.().includes(filters.fabric.toLowerCase());
          const statusMatch =
            !filters.status ||
            (filters.status === "completed" ? lot.ENDT : !lot.ENDT);

          let dateMatch = true;
          if (filters.dateFrom) {
            const startDate = new Date(lot.STDT);
            const fromDate = new Date(filters.dateFrom);
            dateMatch = dateMatch && startDate >= fromDate;
          }
          if (filters.dateTo) {
            const endDate = new Date(lot.ENDT || lot.STDT);
            const toDate = new Date(filters.dateTo);
            dateMatch = dateMatch && endDate <= toDate;
          }

          return (
            matchesSearch &&
            batchNoMatch &&
            customerMatch &&
            fabricMatch &&
            dateMatch &&
            statusMatch
          );
        })
      : [];

  const hasDataError = !isLoading && !error && apiResponse?.statusCode !== 0;
  const hasActiveFilters =
    Object.values(filters).some((val) => val !== "") || searchQuery;

  useEffect(() => {
    setViewMode(isMobile ? "cards" : "table");
  }, [isMobile]);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatus = (lot) => {
    return lot.ENDT ? "completed" : "pending";
  };
  const StatusIndicator = ({ status }) => (
    <div className={`status-indicator ${status}`}>
      {status === "completed" ? (
        <BsCheckCircleFill size={12} />
      ) : (
        <div className="pending-dot" />
      )}
    </div>
  );
  const EmptyState = ({ hasData, hasActiveFilters, onResetFilters }) => (
    <div className="empty-state">
      <div className="empty-state-content">
        <div className="empty-state-icon">
          <FiSearch size={48} />
        </div>
        <h3 className="empty-state-title">
          {!hasData
            ? t.noDataAvailable
            : t.noLotsMatch}
        </h3>
        <p className="empty-state-description">
          {!hasData
            ? t.startByCreating
            : t.tryAdjusting}
        </p>
        {hasActiveFilters && (
          <button className="btn btn-primary" onClick={onResetFilters}>
            {t.clearFilters}
          </button>
        )}
      </div>
    </div>
  );

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetFilters = () => {
    setFilters(filtersInitialState);
    setSearchQuery("");
  };

  const applyFilters = () => {
    setShowFilterModal(false);
  };

  const handleLotClick = (lot) => {
    setSelectedLot(lot);
    setShowActionsMenu(null);
  };

  const closeDetailView = () => {
    setSelectedLot(null);
  };

  const markAsCompleted = async (lotData) => {
    console.log(lotData, "lotId");
    const loadingToast = toast.loading(t.updatingLotStatus);

    try {
      if (!selectedContractor) {
        toast.error(t.pleaseSelectContractor);
        return;
      }
      await updateLot({
        ...lotData,
        status: "COMPLETED",
        processName: "LOT PREPARATION",
        CONTRACTORNAME: selectedContractor,
      }).unwrap();

      toast.success(t.lotMarkedCompleted, { id: loadingToast });
      refetch();
      closeDetailView();
    } catch (err) {
      toast.error(t.failedToUpdateLot, { id: loadingToast });
      console.error("Failed to update lot:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">{t.loadingData}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-card">
          <h3 className="error-title">{t.errorLoading}</h3>
          <p className="error-message">
            {error.message || "Unknown error occurred"}
          </p>
          <button onClick={refetch} className="btn btn-primary">
            <FiRefreshCw className="mr-2" /> {t.retry}
          </button>
        </div>
      </div>
    );
  }

  if (hasDataError) {
    return (
      <div className="error-container">
        <div className="error-card">
          <h3 className="error-title">{t.dataFormatError}</h3>
          <p className="error-message">
            Received unexpected status code: {apiResponse?.statusCode}
          </p>
          <button onClick={refetch} className="btn btn-primary">
            <FiRefreshCw className="mr-2" /> {t.retry}
          </button>
        </div>
      </div>
    );
  }

  const renderFilterModal = () => (
    <div className="modal-overlay" onClick={() => setShowFilterModal(false)}>
      <div className="filter-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">{t.filterLots}</h3>
          <button
            className="bg-red-600 rounded-full text-white p-1"
            onClick={() => setShowFilterModal(false)}
          >
            <FiX size={20} />
          </button>
        </div>
        <div className="modal-content">
          <div className="filter-group">
            <label className="filter-label">{t.batchNo}</label>
            <input
              type="text"
              name="batchNo"
              value={filters.batchNo}
              onChange={handleFilterChange}
              placeholder={t.filterByBatchNo}
              className="filter-input"
            />
          </div>
          <div className="filter-group">
            <label className="filter-label">{t.customer}</label>
            <input
              type="text"
              name="customer"
              value={filters.customer}
              onChange={handleFilterChange}
              placeholder={t.filterByCustomer}
              className="filter-input"
            />
          </div>
          <div className="filter-group">
            <label className="filter-label">{t.fabric}</label>
            <input
              type="text"
              name="fabric"
              value={filters.fabric}
              onChange={handleFilterChange}
              placeholder={t.filterByFabric}
              className="filter-input"
            />
          </div>
        </div>
        <div className="modal-actions">
          <button className="btn btn-outline" onClick={resetFilters}>
            {t.resetFilters}
          </button>
          <button className="btn btn-primary" onClick={applyFilters}>
            {t.applyFilters}
          </button>
        </div>
      </div>
    </div>
  );

  const renderDetailView = () => {
    const mainItem = Array.isArray(selectedLot) ? selectedLot[0] : selectedLot;
    const isGrouped = Array.isArray(selectedLot) && selectedLot.length > 1;
    const totalQuantity = isGrouped
      ? selectedLot.reduce((sum, item) => sum + item.BATQTY, 0)
      : mainItem.BATQTY;
    return (
      <div className="detail-view-overlay" onClick={closeDetailView}>
        <div
          className="detail-view-container"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="detail-view-header">
            <div className="flex items-center gap-3">
              <div className={`status-indicator-lg ${getStatus(selectedLot)}`}>
                {getStatus(mainItem) === "completed" ? (
                  <BsCheckCircleFill size={18} />
                ) : (
                  <div className="pending-dot"></div>
                )}
              </div>
              <div>
                <h3 className="detail-title">{mainItem.BATCHNO}</h3>
                <p className="detail-subtitle">{mainItem.CUSTNAME}</p>
              </div>
            </div>
            <button className="detail-close-btn" onClick={closeDetailView}>
              <FiX size={20} />
            </button>
          </div>
          <div className="detail-view-content">
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-600">{t.color}:</span>
                <span className="text-gray-900">{mainItem.COLOR}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-600">{t.fabric}:</span>
                <span className="text-gray-900">{mainItem.FABRIC}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-600">{t.route}:</span>
                <span className="text-gray-900">{mainItem.ROUTE || "-"}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-600">{t.grnNo}:</span>
                <span className="text-gray-900">{mainItem.GRNNO}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-600">{t.quantity}:</span>
                <span className="text-gray-900">
                  {totalQuantity.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-600">{t.partyDc}:</span>
                <span className="text-gray-900">{mainItem.PARTYDC}</span>
              </div>
            </div>

            {isGrouped && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  {t.allItemsInBatch}
                </h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left">{t.grnNo}</th>
                        <th className="px-3 py-2 text-left">{t.fabric}</th>
                        <th className="px-3 py-2 text-left">{t.quantity}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {selectedLot.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-3 py-2">{item.GRNNO}</td>
                          <td className="px-3 py-2">{item.FABRIC}</td>
                          <td className="px-3 py-2">
                            {item.BATQTY.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            <DropdownField
              label={t.contractor}
              value={selectedContractor}
              options={Contractor}
              valueKey="CONAME"
              onChange={setSelectedContractor}
            />

            {selectedLot.REMARKS && (
              <div className="remarks-section">
                <span className="detail-label">{t.remarks}</span>
                <p className="remarks-text">{selectedLot.REMARKS}</p>
              </div>
            )}
          </div>
          <div className="detail-view-actions">
            <button className="btn btn-outline">
              <FiEdit2 className="mr-2" /> {t.editDetails}
            </button>
            {!selectedLot.ENDT && (
              <button
                className="btn btn-primary"
                onClick={() => markAsCompleted(selectedLot?.[0])}
              >
                <FiCheckCircle className="mr-2" />
                {t.complete}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderCardsView = () => {
    const groupedData = filteredData.reduce((acc, item) => {
      const key = `${item.BATCHNO}_${item.PROCESSNAME}`;

      if (!acc[key]) {
        acc[key] = {
          ...item,
          items: [item],
          BATQTY: item.BATQTY,
          FABRIC: new Set([item.FABRIC]),
          GRNNO: new Set([item.GRNNO]),
          hasIncomplete: !item.ENDT,
          PARTYDC: new Set([item.PARTYDC]),
        };
      } else {
        acc[key].BATQTY += item.BATQTY;
        acc[key].FABRIC.add(item.FABRIC);
        acc[key].GRNNO.add(item.GRNNO);
        acc[key].PARTYDC.add(item.PARTYDC);
        acc[key].items.push(item);
        acc[key].hasIncomplete = acc[key].hasIncomplete || !item.ENDT;
      }
      return acc;
    }, {});

    const processedData = Object.values(groupedData).map((group) => ({
      ...group,
      FABRIC: Array.from(group.FABRIC).join(", "),
      GRNNO: Array.from(group.GRNNO).join(", "),
      PARTYDC: Array.from(group.PARTYDC).join(", "),
    }));

    return (
      <div className="cards-view">
        {processedData.length > 0 ? (
          <div className="cards-grid">
            {processedData.map((item) => (
              <div
                key={item.IID}
                className={`lot-card ${getStatus(item)}`}
                onClick={() => handleLotClick(item.items)}
              >
                <div className="card-header">
                  <div className="flex items-center gap-2">
                    <StatusIndicator status={getStatus(item)} />
                    <span className="batch-no">{item.BATCHNO}</span>
                  </div>
                  <div className="card-date">{formatDate(item.STDT)}</div>
                </div>

                <div className="card-content">
                  {[
                    { label: t.customer, value: item.CUSTNAME },
                    { label: t.color, value: item.COLOR },
                    { label: t.fabric, value: item.FABRIC },
                    { label: t.grnNo, value: item.GRNNO },
                    { label: t.quantity, value: item.BATQTY.toFixed(2) },
                    {
                      label: t.processName,
                      value: item.PROCESSNAME,
                      highlight: true,
                    },
                    { label: t.partyDc, value: item.PARTYDC },
                  ].map((field, idx) => (
                    <div key={idx} className="card-row">
                      <span className="card-label">{field.label}</span>
                      <span
                        className={`${field.highlight ? "text-blue-600 font-semibold" : ""}`}
                      >
                        {field.value}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="card-actions">
                  <button
                    className="btn-icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLotClick(item.items);
                    }}
                    title={t.viewDetails}
                  >
                    <FiEye size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            hasData={apiResponse?.data?.length > 0}
            hasActiveFilters={hasActiveFilters}
            onResetFilters={resetFilters}
          />
        )}
      </div>
    );
  };

  const renderTableView = () => {
    const groupedData = filteredData.reduce((acc, item) => {
      const key = `${item.BATCHNO}_${item.PROCESSNAME}`;

      if (!acc[key]) {
        acc[key] = {
          ...item,
          items: [item],
          BATQTY: item.BATQTY,
          FABRIC: new Set([item.FABRIC]),
          GRNNO: new Set([item.GRNNO]),
          hasIncomplete: !item.ENDT,
          PARTYDC: new Set([item.PARTYDC]),
        };
      } else {
        acc[key].BATQTY += item.BATQTY;
        acc[key].FABRIC.add(item.FABRIC);
        acc[key].GRNNO.add(item.GRNNO);
        acc[key].PARTYDC.add(item.PARTYDC);
        acc[key].items.push(item);
        acc[key].hasIncomplete = acc[key].hasIncomplete || !item.ENDT;
      }
      return acc;
    }, {});

    const processedData = Object.values(groupedData).map((group) => ({
      ...group,
      FABRIC: Array.from(group.FABRIC).join(", "),
      GRNNO: Array.from(group.GRNNO).join(", "),
      PARTYDC: Array.from(group.PARTYDC).join(", "),
    }));

    return (
      <div className="table-view">
        <div className="table-wrapper">
          {processedData.length > 0 ? (
            <table className="lot-table w-full table-auto border-collapse">
              <thead className="bg-gray-100 text-gray-700 text-sm">
                <tr>
                  <th className="text-left px-4 py-2 min-w-[140px]">
                    {t.batchNo}
                  </th>
                  <th className="text-left px-4 py-2 min-w-[160px]">
                    {t.customer}
                  </th>
                  <th className="text-left px-4 py-2 min-w-[160px]">{t.process}</th>
                  <th className="text-left px-4 py-2 min-w-[160px]">{t.fabric}</th>
                  <th className="text-left px-4 py-2 min-w-[120px]">{t.grnNo}</th>
                  <th className="text-right px-4 py-2 w-[80px]">{t.qty}</th>
                  <th className="text-left px-4 py-2 min-w-[120px]">{t.status}</th>
                  <th className="text-left px-4 py-2 min-w-[100px]">{t.actions}</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-800">
                {processedData.map((item) => (
                  <tr
                    key={item.IID}
                    onClick={() => handleLotClick(item.items)}
                    className="hover:bg-gray-50 cursor-pointer border-t"
                  >
                    <td className="px-4 py-2 font-medium">
                      <div className="flex items-center gap-2">
                        <StatusIndicator status={getStatus(item)} />
                        {item.BATCHNO}
                      </div>
                    </td>
                    <td className="px-4 py-2">{item.CUSTNAME}</td>
                    <td className="px-4 py-2 font-medium text-blue-600">
                      {item.PROCESSNAME}
                    </td>
                    <td className="px-4 py-2">{item.FABRIC}</td>
                    <td className="px-4 py-2">{item.GRNNO}</td>
                    <td className="px-4 py-2 text-right">
                      {item.BATQTY.toFixed(2)}
                    </td>
                    <td className="px-4 py-2">
                      <span className={`status-badge ${getStatus(item)}`}>
                        {getStatus(item) === "completed"
                          ? t.completed
                          : t.inProgress}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-2">
                        <button
                          className="text-gray-500 hover:text-blue-600 p-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLotClick(item.items);
                          }}
                          title={t.viewDetails}
                        >
                          <FiEye size={16} />
                        </button>

                        {item.hasIncomplete && (
                          <button
                            className="text-green-600 hover:text-green-700 text-sm flex items-center gap-1 p-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              item.items.forEach((lotItem) => {
                                if (!lotItem.ENDT) markAsCompleted(lotItem);
                              });
                            }}
                            title={t.markAllCompleted}
                          >
                            <FiCheckCircle size={14} />
                            <span className="hidden md:inline">{t.complete}</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <EmptyState
              hasData={apiResponse?.data?.length > 0}
              hasActiveFilters={hasActiveFilters}
              onResetFilters={resetFilters}
            />
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="">
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex flex-wrap justify-between items-center mt-4 gap-3">
          <div className="flex items-center gap-2">
            <div className="relative w-full max-w-sm">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-green-400 focus:border-green-400 transition"
              />
            </div>
            <button
              onClick={() => setViewMode("table")}
              className={`p-2 rounded-md border ${
                viewMode === "table"
                  ? "bg-green-500 text-white"
                  : "bg-gray-100 text-gray-700"
              } hover:bg-green-500 hover:text-white transition`}
              title={t.tableView}
            >
              <MdTableChart size={20} />
            </button>
            <button
              onClick={() => setViewMode("cards")}
              className={`p-2 rounded-md border ${
                viewMode === "cards"
                  ? "bg-green-500 text-white"
                  : "bg-gray-100 text-gray-700"
              } hover:bg-green-500 hover:text-white transition`}
              title={t.cardView}
            >
              <MdGridView size={20} />
            </button>
          </div>

          {filteredData.length > 0 && (
            <span className="inline-flex items-center bg-green-100 text-green-700 text-sm font-semibold  py-1 rounded-2xl shadow-sm">
              {filteredData.length} {filteredData.length === 1 ? t.lot : t.lots}
            </span>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilterModal(true)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium ${
                hasActiveFilters
                  ? "bg-green-600 text-white"
                  : "border border-gray-300 text-gray-700"
              } hover:bg-green-500 hover:text-white transition`}
              title={t.filter}
            >
              <FiFilter />
              {hasActiveFilters && (
                <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
              )}
            </button>

            <button
              onClick={refetch}
              className="p-2 rounded-md bg-gray-100 text-gray-700 hover:bg-green-500 hover:text-white transition"
              title={t.refresh}
            >
              <FiRefreshCw size={18} />
            </button>
          </div>
        </div>
      </div>

      {viewMode === "table" ? renderTableView() : renderCardsView()}

      {showFilterModal && renderFilterModal()}
      {selectedLot && renderDetailView()}
    </div>
  );
};

export default LotPreparation;
