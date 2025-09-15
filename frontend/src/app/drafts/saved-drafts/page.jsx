"use client";

import React, { useState, useEffect } from "react";
import {
  CalendarDays, ListOrdered, LayoutGrid, List, Trash2, FolderPlus, Plus, Eye
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSelector } from "react-redux";
import { apiService } from "@/app/api_service";
import { toast } from "sonner";
import { useColorScheme } from '@mui/material/styles';
import {
  Tooltip, Modal, Box, Typography, Button, Stack, Backdrop, Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Chip,
  Divider
} from "@mui/material";
import { Warning } from "@mui/icons-material";

export default function Page() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [layout, setLayout] = useState("Grid");
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortDir, setSortDir] = useState({
    date: 'desc',
    length: 'desc'
  });
  const router = useRouter();
  const user = useSelector((state) => state.user.user);
  const { mode } = useColorScheme();

  useEffect(() => {
    getSavedDrafts();
  }, []);

  const getSavedDrafts = async () => {
    const response = await apiService.get(`/ai/get-saved-drafts/${user?._id}`);
    if (response.status) {
      setData(response.data);
      setFilteredData(response.data);
    } else {
      toast.error(response.message);
    }
  };

  function countWords(text) {
    if (!text) return 0;
    const withoutTags = text.replace(/<[^>]*>/g, " ");
    const normalized = withoutTags.replace(/\u00A0/g, " ").trim();
    if (!normalized) return 0;
    return normalized.split(/\s+/).filter(Boolean).length;
  }

  const handleViewClick = (item) => {
    setViewData(item);
    setOpenViewModal(true);
  }

  const handleCancelView = () => {
    setOpenViewModal(false);
    setViewData(null);
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setOpenDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await apiService.post(`/ai/delete-draft/${deleteId}`);
      toast.success("Saved draft deleted successfully!");
      setOpenDeleteModal(false);
      setDeleteId(null);
      getSavedDrafts();
    } catch {
      toast.error("Failed to delete draft");
    }
  };

  const handleCancelDelete = () => {
    setOpenDeleteModal(false);
    setDeleteId(null);
  };

  const searchDraft = (e) => {
    const input = (e.target.value)?.toLowerCase();
    setSearchQuery(input);

    if (!input || input == "") {
      setFilteredData(data);
      setSearchQuery("");
    }

    const filtered = data?.filter((item) => {
      return (
        item?.prompt_idea?.toLowerCase()?.includes(input) ||
        item?.final_enriched_text?.toLowerCase()?.includes(input)
      )
    });

    setFilteredData(filtered);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setFilteredData(data);
  }

  const getText = (it) =>
    (it?.final_enriched_text ?? it?.final_enrichment_text ?? '').toString();

  const wordCount = (s) =>
    s.trim() === '' ? 0 : s.trim().split(/\s+/).length;

  const sortByDate = () => {
    setFilteredData((prev) => {
      const isAsc = sortDir.date === 'asc';
      const cmp = isAsc
        ? (a, b) =>
          new Date(a?.created_at ?? a?.createdAt) -
          new Date(b?.created_at ?? b?.createdAt)
        : (a, b) =>
          new Date(b?.created_at ?? b?.createdAt) -
          new Date(a?.created_at ?? a?.createdAt);
      return [...prev].sort(cmp);
    });
    setSortDir((d) => ({ ...d, date: d.date === 'asc' ? 'desc' : 'asc' }));
  };

  const sortByLength = () => {
    setFilteredData((prev) => {
      const isAsc = sortDir.length === 'asc';
      const cmp = isAsc
        ? (a, b) => wordCount(getText(a)) - wordCount(getText(b))
        : (a, b) => wordCount(getText(b)) - wordCount(getText(a));
      return [...prev].sort(cmp);
    });
    setSortDir((d) => ({ ...d, length: d.length === 'asc' ? 'desc' : 'asc' }));
  };

  return (
    <div className={`flex h-screen overflow-hidden ${mode === 'dark' ? '' : 'bg-slate-100'}`}
         style={mode === 'dark' ? { backgroundColor: 'var(--mui-palette-background-default)' } : {}}>
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto font-inter">
          <h2 className={`text-[18px] font-semibold text-slate-900 mb-5 ${mode === 'dark' ? '' : 'text-slate-900'}`}
              style={mode === 'dark' ? { color: 'var(--mui-palette-text-primary)' } : {}}>
            Saved Drafts
          </h2>

          <div className="flex flex-wrap items-center gap-3 mb-8">
            <button 
              onClick={() => { sortByDate() }} 
              className={`cursor-pointer inline-flex items-center gap-2 rounded-[10px] px-4 py-2 bg-[#EDF5FF] text-[#004EEB] text-sm font-medium ${mode === 'dark' ? '' : 'bg-[#EDF5FF] text-[#004EEB]'}`}
              style={mode === 'dark' ? {
                backgroundColor: 'rgba(37, 99, 235, 0.2)',
                color: '#004EEB'
              } : {}}
              onMouseEnter={(e) => {
                if (mode === 'dark') {
                  e.target.style.backgroundColor = 'rgba(37, 99, 235, 0.3)';
                }
              }}
              onMouseLeave={(e) => {
                if (mode === 'dark') {
                  e.target.style.backgroundColor = 'rgba(37, 99, 235, 0.2)';
                }
              }}
            >
              <CalendarDays className="w-4 h-4 stroke-[2.4]" />
              Sort by Date
            </button>

            <button 
              onClick={() => { sortByLength() }} 
              className={`cursor-pointer inline-flex items-center gap-2 rounded-[10px] px-4 py-2 bg-[#EDF5FF] text-[#004EEB] text-sm font-medium ${mode === 'dark' ? '' : 'bg-[#EDF5FF] text-[#004EEB]'}`}
              style={mode === 'dark' ? {
                backgroundColor: 'rgba(37, 99, 235, 0.2)',
                color: '#004EEB'
              } : {}}
              onMouseEnter={(e) => {
                if (mode === 'dark') {
                  e.target.style.backgroundColor = 'rgba(37, 99, 235, 0.3)';
                }
              }}
              onMouseLeave={(e) => {
                if (mode === 'dark') {
                  e.target.style.backgroundColor = 'rgba(37, 99, 235, 0.2)';
                }
              }}
            >
              <ListOrdered className="w-4 h-4 stroke-[2.4]" />
              Sort by Length
            </button>

            <input
              id="search_input"
              type="search"
              value={searchQuery}
              onChange={(e) => { searchDraft(e) }}
              placeholder="Search drafts"
              className={`flex-grow min-w-[220px] h-[38px] px-4 rounded-[10px] border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-[#004EEB]/40 ${mode === 'dark' ? '' : 'border-gray-300'}`}
              style={mode === 'dark' ? {
                backgroundColor: 'var(--mui-palette-background-paper)',
                borderColor: 'var(--mui-palette-divider)',
                color: 'var(--mui-palette-text-primary)'
              } : {}}
            />

            {filteredData?.length > 0 && (
              <div 
                className={`ml-auto flex gap-[2px] bg-[#EDF5FF] rounded-[18px] p-[2px] ${mode === 'dark' ? '' : 'bg-[#EDF5FF]'}`}
                style={mode === 'dark' ? {
                  backgroundColor: 'rgba(37, 99, 235, 0.2)'
                } : {}}
              >
                <button
                  onClick={() => setLayout("Grid")}
                  className={`cursor-pointer inline-flex items-center gap-1 px-4 py-1.5 text-sm rounded-[16px] font-medium transition-colors ${
                    layout === "Grid" ? "bg-[#004EEB] text-white" : "text-[#004EEB] hover:bg-white"
                  }`}
                  onMouseEnter={(e) => {
                    if (layout !== "Grid" && mode === 'dark') {
                      e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (layout !== "Grid" && mode === 'dark') {
                      e.target.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <LayoutGrid className="w-4 h-4 stroke-[2.4]" />
                  Grid
                </button>
                <button
                  onClick={() => setLayout("List")}
                  className={`cursor-pointer inline-flex items-center gap-1 px-4 py-1.5 text-sm rounded-[16px] font-medium transition-colors ${
                    layout === "List" ? "bg-[#004EEB] text-white" : "text-[#004EEB] hover:bg-white"
                  }`}
                  onMouseEnter={(e) => {
                    if (layout !== "List" && mode === 'dark') {
                      e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (layout !== "List" && mode === 'dark') {
                      e.target.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <List className="w-4 h-4 stroke-[2.4]" />
                  List
                </button>
              </div>
            )}
          </div>

          {filteredData?.length > 0 ? (
            <>
              {layout === "Grid" ? (
                <>
                  <h3 className={`text-xs font-medium text-gray-500 mb-3 ${mode === 'dark' ? '' : 'text-gray-500'}`}
                      style={mode === 'dark' ? { color: 'var(--mui-palette-text-secondary)' } : {}}>
                    Grid View
                  </h3>
                  <div className="grid gap-6 md:grid-cols-3 mb-10">
                    {filteredData.map((item) => (
                      <div
                        key={item?._id}
                        className={`bg-white rounded-[14px] shadow-[0_2px_6px_rgba(0,0,0,0.05)] p-5 flex flex-col gap-4 ${mode === 'dark' ? '' : 'bg-white'}`}
                        style={mode === 'dark' ? {
                          backgroundColor: 'var(--mui-palette-background-paper)',
                          borderColor: 'var(--mui-palette-divider)',
                          border: '1px solid'
                        } : {}}
                      >
                        <p className={`font-semibold text-[15px] leading-snug line-clamp-2 ${mode === 'dark' ? '' : 'text-gray-900'}`}
                           style={mode === 'dark' ? { color: 'var(--mui-palette-text-primary)' } : {}}>
                          {item?.prompt_idea}
                        </p>
                        <p className={`mt-1 text-sm text-gray-600 line-clamp-2 ${mode === 'dark' ? '' : 'text-gray-600'}`}
                           style={mode === 'dark' ? { color: 'var(--mui-palette-text-secondary)' } : {}}>
                          {item?.final_enriched_text?.split(" ").slice(0, 20).join(" ") +
                            (item?.final_enriched_text?.split(" ").length > 20 ? "..." : "")}
                        </p>
                        <div className={`text-[11px] text-gray-400 flex justify-between ${mode === 'dark' ? '' : 'text-gray-400'}`}
                             style={mode === 'dark' ? { color: 'var(--mui-palette-text-secondary)' } : {}}>
                          <span>
                            {item?.created_at
                              ? new Date(item.created_at).toLocaleDateString("en-US", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })
                              : ""}
                          </span>
                          <span>{countWords(item?.final_enriched_text)} words</span>
                        </div>

                        <div className="mt-auto flex gap-2">
                          <CommonIcons onView={() => handleViewClick(item)} onDelete={() => handleDeleteClick(item._id)} />
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <h3 className={`text-xs font-medium text-gray-500 mb-3 ${mode === 'dark' ? '' : 'text-gray-500'}`}
                      style={mode === 'dark' ? { color: 'var(--mui-palette-text-secondary)' } : {}}>
                    List View
                  </h3>
                  <div className="space-y-3">
                    {filteredData.map((item) => {
                      const full = (item?.final_enriched_text || "").trim();
                      const words = full ? full.split(/\s+/) : [];
                      const preview = words.slice(0, 20).join(" ");
                      const previewText = words.length > 20 ? `${preview}...` : preview;

                      return (
                        <div
                          key={item?._id}
                          className={`bg-white rounded-[14px] shadow-[0_2px_6px_rgba(0,0,0,0.05)] flex items-center px-4 py-3 ${mode === 'dark' ? '' : 'bg-white'}`}
                          style={mode === 'dark' ? {
                            backgroundColor: 'var(--mui-palette-background-paper)',
                            borderColor: 'var(--mui-palette-divider)',
                            border: '1px solid'
                          } : {}}
                        >
                          <div className="flex-1 min-w-0 flex flex-col">
                            <p className={`text-[15px] font-semibold truncate ${mode === 'dark' ? '' : 'text-gray-900'}`}
                               style={mode === 'dark' ? { color: 'var(--mui-palette-text-primary)' } : {}}>
                              {item?.prompt_idea}
                            </p>
                            <div className="min-w-0">
                              <p className={`text-sm text-gray-600 truncate ${mode === 'dark' ? '' : 'text-gray-600'}`}
                                 style={mode === 'dark' ? { color: 'var(--mui-palette-text-secondary)' } : {}}>
                                {previewText}
                              </p>
                            </div>
                          </div>

                          <span className={`w-32 text-[11px] text-gray-400 text-right shrink-0 ${mode === 'dark' ? '' : 'text-gray-400'}`}
                                style={mode === 'dark' ? { color: 'var(--mui-palette-text-secondary)' } : {}}>
                            {item?.created_at
                              ? new Date(item.created_at).toLocaleDateString("en-US", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })
                              : ""}
                          </span>

                          <span className={`w-20 text-[11px] text-gray-400 text-right shrink-0 ${mode === 'dark' ? '' : 'text-gray-400'}`}
                                style={mode === 'dark' ? { color: 'var(--mui-palette-text-secondary)' } : {}}>
                            {countWords(item?.final_enriched_text)} words
                          </span>

                          <div className="flex gap-2 pl-4 shrink-0">
                            <CommonIcons onView={() => handleViewClick(item)} onDelete={() => handleDeleteClick(item._id)} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </>
          ) : (
            <>
              {!(data?.length > 0 && filteredData?.length == 0) ? 
                <div 
                  className={`bg-white border border-gray-200 rounded-[14px] text-center py-20 mt-6 min-h-[360px] flex flex-col items-center justify-center ${mode === 'dark' ? '' : 'bg-white border-gray-200'}`}
                  style={mode === 'dark' ? {
                    backgroundColor: 'var(--mui-palette-background-paper)',
                    borderColor: 'var(--mui-palette-divider)',
                    border: '1px solid'
                  } : {}}
                >
                  <div 
                    className={`mx-auto mb-6 w-16 h-16 rounded-[18px] bg-[#E0EBFF] text-[#004EEB] flex items-center justify-center ${mode === 'dark' ? '' : 'bg-[#E0EBFF] text-[#004EEB]'}`}
                    style={mode === 'dark' ? {
                      backgroundColor: 'rgba(37, 99, 235, 0.2)',
                      color: '#004EEB'
                    } : {}}
                  >
                    <FolderPlus className="w-8 h-8" />
                  </div>
                  <h4 className={`text-lg font-semibold text-gray-900 mb-2 ${mode === 'dark' ? '' : 'text-gray-900'}`}
                      style={mode === 'dark' ? { color: 'var(--mui-palette-text-primary)' } : {}}>
                    No drafts yet. Start writing your first draft.
                  </h4>
                  <p className={`text-sm text-gray-500 mb-7 ${mode === 'dark' ? '' : 'text-gray-500'}`}
                     style={mode === 'dark' ? { color: 'var(--mui-palette-text-secondary)' } : {}}>
                    Your drafts will appear here once you save them. Try adjusting your search or sorting.
                  </p>
                  <Link
                    href="/drafts/new-draft"
                    className="cursor-pointer inline-flex items-center gap-2 bg-[#004EEB] hover:bg-[#003BB5] text-white text-sm font-medium px-6 py-2 rounded-[10px]"
                  >
                    <Plus className="w-4 h-4" /> New Draft
                  </Link>
                </div>
                :
                <div 
                  className={`bg-white border border-gray-200 rounded-[14px] text-center py-20 mt-6 min-h-[360px] flex flex-col items-center justify-center ${mode === 'dark' ? '' : 'bg-white border-gray-200'}`}
                  style={mode === 'dark' ? {
                    backgroundColor: 'var(--mui-palette-background-paper)',
                    borderColor: 'var(--mui-palette-divider)',
                    border: '1px solid'
                  } : {}}
                >
                  <div 
                    className={`mx-auto mb-6 w-16 h-16 rounded-[18px] bg-[#E0EBFF] text-[#004EEB] flex items-center justify-center ${mode === 'dark' ? '' : 'bg-[#E0EBFF] text-[#004EEB]'}`}
                    style={mode === 'dark' ? {
                      backgroundColor: 'rgba(37, 99, 235, 0.2)',
                      color: '#004EEB'
                    } : {}}
                  >
                    <svg
                      className="w-8 h-8"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path d="M14.5 16.5L17 19" />
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <path d="M14 2v6h6" />
                      <circle cx="11.5" cy="14.5" r="2.5" />
                    </svg>
                  </div>

                  <h4 className={`text-lg font-semibold text-gray-900 mb-2 ${mode === 'dark' ? '' : 'text-gray-900'}`}
                      style={mode === 'dark' ? { color: 'var(--mui-palette-text-primary)' } : {}}>
                    No saved drafts match the search.
                  </h4>

                  <p className={`text-sm text-gray-500 mb-7 ${mode === 'dark' ? '' : 'text-gray-500'}`}
                     style={mode === 'dark' ? { color: 'var(--mui-palette-text-secondary)' } : {}}>
                    Try different keywords, check spelling, or clear filters to see results.
                  </p>

                  <button
                    onClick={() => clearSearch()}
                    type="button"
                    className="cursor-pointer inline-flex items-center gap-2 bg-[#004EEB] hover:bg-[#003BB5] text-white text-sm font-medium px-6 py-2 rounded-[10px]"
                    aria-label="Clear search"
                  >
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.3-4.3" />
                    </svg>
                    Clear search
                  </button>
                </div>
              }
            </>
          )}
        </div>
      </div>

      <WarningModal
        open={openDeleteModal}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

      <DraftViewModal
        open={openViewModal}
        onClose={() => handleCancelView()}
        document={viewData}
      />
    </div>
  );
}

function CommonIcons({ onView, onDelete }) {
  const { mode } = useColorScheme();
  
  return (
    <>
      <Tooltip title="View">
        <button 
          className={`cursor-pointer p-2 rounded-lg hover:bg-blue-50 transition-colors ${mode === 'dark' ? '' : 'hover:bg-blue-50'}`}
          onClick={onView}
          onMouseEnter={(e) => {
            if (mode === 'dark') {
              e.target.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
            }
          }}
          onMouseLeave={(e) => {
            if (mode === 'dark') {
              e.target.style.backgroundColor = 'transparent';
            }
          }}
        >
          <Eye className="w-5 h-5 text-blue-500" />
        </button>
      </Tooltip>

      <Tooltip title="Delete">
        <button 
          className={`cursor-pointer p-2 rounded-lg hover:bg-red-50 transition-colors ${mode === 'dark' ? '' : 'hover:bg-red-50'}`}
          onClick={onDelete}
          onMouseEnter={(e) => {
            if (mode === 'dark') {
              e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
            }
          }}
          onMouseLeave={(e) => {
            if (mode === 'dark') {
              e.target.style.backgroundColor = 'transparent';
            }
          }}
        >
          <Trash2 className="w-5 h-5 text-red-500" />
        </button>
      </Tooltip>
    </>
  );
}

function WarningModal({ open, onCancel, onConfirm }) {
  return (
    <Modal
      open={open}
      onClose={onCancel}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 300,
          sx: { bgcolor: "rgba(0,0,0,0.65)" },
        },
      }}
      aria-labelledby="delete-warning-title"
      aria-describedby="delete-warning-desc"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 420,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          outline: "none",
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center" mb={2}>
          <Warning color="warning" fontSize="large" />
          <Typography id="delete-warning-title" variant="h6" fontWeight="bold">
            Your saved draft will be deleted permanently.
          </Typography>
        </Stack>

        <Typography id="delete-warning-desc" variant="body2" color="text.secondary" mb={3}>
          This action cannot be undone.
        </Typography>

        <Stack direction="row" spacing={2}>
          <Button fullWidth variant="contained" color="error" onClick={onConfirm}>
            Confirm
          </Button>
          <Button fullWidth variant="outlined" color="inherit" onClick={onCancel}>
            Cancel
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
}

function DraftViewModal({ open, onClose, document }) {
  const {
    prompt_idea = '',
    final_enriched_text = '',
    tone = '-',
    platform = '-',
    refinement_journey = []
  } = document || {};

  const latest = refinement_journey?.[refinement_journey.length - 1] || {};
  const ratingValue = latest?.rating ?? '-';
  const hashtags = Array.isArray(latest?.hashtags) ? latest.hashtags : [];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: 'hidden',
          boxShadow: '0 12px 40px rgba(2, 6, 23, 0.20)',
          border: '1px solid',
          borderColor: 'divider',
          backgroundImage: (theme) => theme.palette.mode === 'dark' 
            ? 'linear-gradient(180deg, rgba(99,102,241,0.05), rgba(236,72,153,0.03))'
            : 'linear-gradient(180deg, rgba(99,102,241,0.08), rgba(236,72,153,0.06))',
          bgcolor: 'background.paper'
        }
      }}
    >
      <Box sx={{ height: 4, background: 'linear-gradient(90deg,#6366F1,#A855F7,#EC4899)' }} />

      <DialogTitle sx={{ py: 2.25 }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            style={{ color: 'var(--mui-palette-primary-main)' }}
          >
            <path d="M9 12h6" />
            <path d="M9 16h6" />
            <path d="M4 7h16" />
          </svg>
          <Typography variant="h6" fontWeight={800} lineHeight={1.25} color="text.primary">
            {prompt_idea || 'Untitled Draft'}
          </Typography>

          <Box className="ml-auto">
            <Chip
              label="View only"
              size="small"
              color="default"
              variant="outlined"
              sx={{
                fontWeight: 600,
                bgcolor: 'action.hover',
                borderColor: 'divider',
                color: 'text.secondary'
              }}
            />
          </Box>
        </Stack>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ pt: 2.5, pb: 2 }}>
        <Grid container spacing={2.5}>
          <Grid item xs={12} md={8}>
            <Box
              className="rounded-2xl"
              sx={{
                maxHeight: { xs: 320, md: 420 },
                overflowY: 'auto',
                bgcolor: 'action.hover',
                border: '1px solid',
                borderColor: 'divider',
                p: 2.25
              }}
            >
              <Typography
                variant="body1"
                sx={{ whiteSpace: 'pre-wrap' }}
                color="text.primary"
              >
                {final_enriched_text || 'No content available.'}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box
              sx={{
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                p: 2
              }}
            >
              <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }} color="text.primary">
                Details
              </Typography>

              <Stack spacing={1.25}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ color: 'var(--mui-palette-primary-main)' }}>
                    <path d="M12 2v20" strokeWidth="2" />
                    <path d="M5 9h14" strokeWidth="2" />
                  </svg>
                  <Typography variant="caption" color="text.secondary" sx={{ minWidth: 72 }}>
                    Tone
                  </Typography>
                  <Typography variant="body2" fontWeight={600} color="text.primary">{tone || '-'}</Typography>
                </Stack>

                <Stack direction="row" spacing={1} alignItems="center">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ color: 'var(--mui-palette-primary-main)' }}>
                    <rect x="3" y="4" width="18" height="12" rx="2" strokeWidth="2" />
                    <path d="M8 20h8" strokeWidth="2" />
                  </svg>
                  <Typography variant="caption" color="text.secondary" sx={{ minWidth: 72 }}>
                    Platform
                  </Typography>
                  <Typography variant="body2" fontWeight={600} color="text.primary">{platform || '-'}</Typography>
                </Stack>

                <Stack direction="row" spacing={1} alignItems="center">
                  <svg className="w-4 h-4 text-yellow-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z" />
                  </svg>
                  <Typography variant="caption" color="text.secondary" sx={{ minWidth: 72 }}>
                    Rating
                  </Typography>
                  <Typography variant="body2" fontWeight={700} color="text.primary">{String(ratingValue)}</Typography>
                </Stack>

                <Divider sx={{ my: 1 }} />

                <Typography variant="caption" color="text.secondary">
                  Hashtags
                </Typography>
                {hashtags?.length > 0 ? (
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {hashtags.map((tag, i) => (
                      <Chip
                        key={`${tag}-${i}`}
                        label={tag?.startsWith('#') ? tag : `#${tag}`}
                        size="small"
                        variant="outlined"
                        sx={{ 
                          mb: 1,
                          borderColor: 'divider',
                          color: 'text.secondary'
                        }}
                      />
                    ))}
                  </Stack>
                ) : (
                  <Typography variant="body2" color="text.disabled">
                    No hashtags
                  </Typography>
                )}
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button
          onClick={onClose}
          variant="contained"
          color="primary"
          disableElevation
          sx={{
            fontWeight: 700,
            backgroundColor: 'action.hover',
            color: 'primary.main',
            borderRadius: '8px',
            border: '1px solid',
            borderColor: 'divider',
            transition: 'background-color .2s ease, border-color .2s ease, box-shadow .2s ease',
            '&:hover': {
              backgroundColor: 'action.selected',
              borderColor: 'primary.main',
              boxShadow: '0 1px 2px rgba(0,0,0,.06)',
            },
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
