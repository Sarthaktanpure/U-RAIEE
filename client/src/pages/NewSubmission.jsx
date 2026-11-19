import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Lightbulb, Wrench, Microscope, Box, Send, Upload, FileText, CheckCircle2, X, AlertCircle } from 'lucide-react';

export default function NewSubmission() {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('idea');
  const [domain, setDomain] = useState('');
  const [keywords, setKeywords] = useState('');
  const [description, setDescription] = useState('');
  const [documentUrl, setDocumentUrl] = useState('');
  const [documentName, setDocumentName] = useState('');
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const types = [
    { id: 'idea', label: 'Idea', desc: 'Conceptual hypothesis & validation', icon: Lightbulb },
    { id: 'project', label: 'Project', desc: 'Applied engineering implementation', icon: Wrench },
    { id: 'research', label: 'Research', desc: 'Empirical data & paper thesis', icon: Microscope },
    { id: 'prototype', label: 'Prototype', desc: 'Working laboratory or field hardware/software', icon: Box },
  ];

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploadingFile(true);
      setUploadError('');
      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setDocumentUrl(res.data.fileUrl);
      setDocumentName(res.data.fileName);
    } catch (err) {
      setUploadError(err.response?.data?.message || 'Failed to upload document. Maximum allowed size is 25MB.');
    } finally {
      setUploadingFile(false);
    }
  };

  const removeUploadedFile = () => {
    setDocumentUrl('');
    setDocumentName('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/submissions', {
        title,
        type,
        domain,
        keywords,
        description,
        documentUrl,
        documentName
      });
      navigate(`/submissions/${res.data.submission._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit work.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="card-premium">
        <div className="pb-6 border-b border-slate-100">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            New Academic Submission
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Register your academic work for institutional progression. All submissions undergo structured human evaluation.
          </p>
        </div>

        {error && (
          <div className="mt-4 p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {/* Work Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Work Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Adaptive Distributed Grid Synchronization Protocol"
              className="input-field"
            />
          </div>

          {/* Type Selector Cards */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">Select Submission Category</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {types.map((t) => {
                const Icon = t.icon;
                const isSelected = type === t.id;
                return (
                  <div
                    key={t.id}
                    onClick={() => setType(t.id)}
                    className={`cursor-pointer p-4 rounded-xl border text-left transition-all duration-150 flex items-start gap-3.5 ${
                      isSelected
                        ? 'border-brand-500 bg-brand-50/40 ring-2 ring-brand-500/10 shadow-xs'
                        : 'border-slate-200 bg-white hover:bg-slate-50/70'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      isSelected ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900">{t.label}</div>
                      <div className="text-xs text-slate-500">{t.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Domain & Keywords */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Academic Domain</label>
              <input
                type="text"
                required
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="e.g. Energy, Computing, Healthcare, Materials"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Focus Keywords (comma-separated)</label>
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="e.g. renewable, distributed, consensus"
                className="input-field"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Keywords prioritize relevant milestone recommendations.
              </p>
            </div>
          </div>

          {/* Scope Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Detailed Technical Description</label>
            <textarea
              rows="5"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Outline the technical scope, methodology, architecture, and expected findings..."
              className="input-field"
            />
          </div>

          {/* Real Document / PDF Uploading */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Attach Proposal Document / Paper (PDF, Word, Images, etc. - Optional)
            </label>

            {documentUrl ? (
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
                <div className="flex items-center gap-2.5 truncate">
                  <FileText className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <span className="text-xs font-semibold text-emerald-950 truncate">{documentName}</span>
                  <span className="badge-pill bg-emerald-100 text-emerald-800 text-[10px]">Ready</span>
                </div>
                <button
                  type="button"
                  onClick={removeUploadedFile}
                  className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                  title="Remove file"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div>
                <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 hover:border-brand-500 rounded-xl cursor-pointer bg-slate-50/50 hover:bg-white transition-all">
                  <Upload className="w-6 h-6 text-slate-400 mb-1.5" />
                  <span className="text-xs font-semibold text-slate-700">
                    {uploadingFile ? 'Uploading document...' : 'Click to upload attachment or drag & drop'}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-0.5">
                    PDF, DOC, DOCX, ZIP up to 25MB
                  </span>
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    disabled={uploadingFile}
                    className="hidden"
                  />
                </label>
              </div>
            )}

            {uploadError && (
              <p className="text-xs text-rose-600 mt-1.5">{uploadError}</p>
            )}
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              type="submit"
              disabled={loading || uploadingFile}
              className="btn-primary"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? 'Submitting to Portal...' : 'Submit work'}</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
