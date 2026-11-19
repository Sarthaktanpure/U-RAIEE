import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';
import { motion } from 'framer-motion';
import {
  Compass,
  Award,
  CheckCircle2,
  AlertCircle,
  FileText,
  UserCheck,
  Send,
  ExternalLink,
  Sparkles,
  RefreshCw,
  TrendingUp,
  Layers,
  Upload,
  X
} from 'lucide-react';

export default function SubmissionDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const serverBase = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/api\/?$/, '');

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Refinement form state
  const [description, setDescription] = useState('');
  const [refinementNote, setRefinementNote] = useState('');
  const [refining, setRefining] = useState(false);

  // Outcome reporting state
  const [outcomeTitle, setOutcomeTitle] = useState('');
  const [outcomeDescription, setOutcomeDescription] = useState('');
  const [evidenceLink, setEvidenceLink] = useState('');
  const [evidenceDocument, setEvidenceDocument] = useState('');
  const [evidenceDocumentName, setEvidenceDocumentName] = useState('');
  const [uploadingEvidence, setUploadingEvidence] = useState(false);
  const [uploadEvidenceError, setUploadEvidenceError] = useState('');
  const [reportingOutcome, setReportingOutcome] = useState(false);

  const fetchDetail = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/submissions/${id}`);
      setData(res.data);
      setDescription(res.data.submission.description || '');
      setOutcomeTitle(`Validated Outcome: ${res.data.submission.title}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load submission details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const handleRefine = async (e) => {
    e.preventDefault();
    try {
      setRefining(true);
      setError('');
      setSuccessMsg('');
      await api.put(`/submissions/${id}/refine`, {
        description,
        refinementNote
      });
      setSuccessMsg('Refined work submitted successfully! Status updated to refined (+10 Progression Merit).');
      setRefinementNote('');
      fetchDetail();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit refinement.');
    } finally {
      setRefining(false);
    }
  };

  const handleEvidenceUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploadingEvidence(true);
      setUploadEvidenceError('');
      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setEvidenceDocument(res.data.fileUrl);
      setEvidenceDocumentName(res.data.fileName);
    } catch (err) {
      setUploadEvidenceError(err.response?.data?.message || 'Failed to upload evidence file.');
    } finally {
      setUploadingEvidence(false);
    }
  };

  const handleReportOutcome = async (e) => {
    e.preventDefault();
    try {
      setReportingOutcome(true);
      setError('');
      setSuccessMsg('');
      await api.post(`/outcomes/${id}`, {
        title: outcomeTitle,
        description: outcomeDescription,
        evidenceLink,
        evidenceDocument,
        evidenceDocumentName
      });
      setSuccessMsg('Outcome reported successfully! Forwarded to Administrator for verification.');
      fetchDetail();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to report outcome.');
    } finally {
      setReportingOutcome(false);
    }
  };

  if (loading) {
    return (
      <div className="card-premium text-center py-16 text-slate-500 text-sm">
        Loading submission record &amp; progression ledger...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="card-premium text-center py-12 text-rose-600 text-sm">
        Submission record not found.
      </div>
    );
  }

  const { submission, reviews, outcome } = data;
  const isOwner = user && submission.owner && user._id === submission.owner._id;

  const expertReview = reviews.find(r => r.kind === 'expert');
  const progressionReview = reviews.find(r => r.kind === 'progression');

  return (
    <div className="space-y-6">
      {/* Header Dossier */}
      <div className="card-premium">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="badge-pill bg-slate-100 text-slate-700 capitalize font-medium">{submission.type}</span>
              <span className="text-slate-300">&bull;</span>
              <span className="text-xs font-semibold text-brand-600">{submission.domain}</span>
              <span className="text-slate-300">&bull;</span>
              <span className="text-xs text-slate-500">{submission.stage}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {submission.title}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Author: <strong className="text-slate-700">{submission.owner.name}</strong> ({submission.owner.institution}, {submission.owner.department})
              &bull; Submitted on {new Date(submission.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
            </p>
          </div>

          <div className="self-start lg:self-auto">
            <StatusBadge status={submission.status} />
          </div>
        </div>

        {successMsg && (
          <div className="mt-4 p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {error && (
          <div className="mt-4 p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs">
            {error}
          </div>
        )}

        {/* Technical Description */}
        <div className="mt-6 space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Technical Scope Description</label>
          <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 text-sm text-slate-800 leading-relaxed whitespace-pre-line font-normal">
            {submission.description}
          </div>
        </div>

        {/* Attached Document (if uploaded) */}
        {submission.documentUrl && (
          <div className="mt-4 p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <FileText className="w-5 h-5 text-brand-600 flex-shrink-0" />
              <div>
                <div className="text-xs font-semibold text-slate-800">
                  {submission.documentName || 'Attached Technical Document'}
                </div>
                <div className="text-[10px] text-slate-400">Official Submission Attachment</div>
              </div>
            </div>
            <a
              href={`${serverBase}${submission.documentUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary btn-small inline-flex items-center gap-1.5"
            >
              <span>Download Document</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}

        {submission.keywords && submission.keywords.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1">Keywords:</span>
            {submission.keywords.map((kw, i) => (
              <span key={i} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-xs font-medium border border-slate-200/60">
                {kw}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Recommended Pathway */}
      <div className="card-premium">
        <div className="flex items-center gap-2 mb-2">
          <Compass className="w-4 h-4 text-brand-600" />
          <h2 className="text-base font-bold text-slate-900">Progression Pathway &amp; Recommendation</h2>
        </div>

        <div className="p-4 rounded-xl bg-gradient-to-r from-brand-50/80 to-blue-50/40 border border-brand-200/60 mb-5">
          <div className="font-semibold text-brand-900 text-sm">
            {submission.headlineRecommendation || 'Structured academic pathway active.'}
          </div>
          <div className="text-xs text-brand-700/80 mt-1 font-medium">
            {submission.recommendationSource}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {submission.recommendedPathway.map((step, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs flex items-center gap-3"
            >
              <div className="w-7 h-7 rounded-lg bg-brand-50 text-brand-700 font-bold text-xs flex items-center justify-center flex-shrink-0 border border-brand-200">
                {idx + 1}
              </div>
              <div className="text-xs font-semibold text-slate-800 truncate">
                {step}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Expert Evaluation Section */}
      <div className="card-premium">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">Expert Evaluation</h2>
          </div>
          {expertReview && (
            <span className="badge-pill bg-emerald-50 text-emerald-700 border border-emerald-200">
              Evaluated
            </span>
          )}
        </div>

        {expertReview ? (
          <div className="space-y-4">
            <div className="text-xs text-slate-500">
              Evaluated by accredited Expert: <strong className="text-slate-800">{submission.expert?.name || 'Assigned Expert'}</strong> on {new Date(expertReview.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
            </div>

            {/* 4 Scorecards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Originality', score: expertReview.scores?.originality },
                { label: 'Feasibility', score: expertReview.scores?.feasibility },
                { label: 'Impact', score: expertReview.scores?.impact },
                { label: 'Clarity', score: expertReview.scores?.clarity },
              ].map((s) => (
                <div key={s.label} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 text-center">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">{s.label}</div>
                  <div className="text-xl font-extrabold text-brand-700">{s.score} <span className="text-xs text-slate-400 font-normal">/ 5</span></div>
                </div>
              ))}
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">Expert Guidance &amp; Critique</label>
              <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 text-sm text-slate-800 leading-relaxed whitespace-pre-line font-normal">
                {expertReview.comments}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-sm text-slate-500 py-3">
            {submission.expert ? (
              <p>Assigned to Expert <strong className="text-slate-800">{submission.expert.name}</strong>. Technical assessment is in queue.</p>
            ) : (
              <p>Pending Administrator assignment of an accredited domain Expert.</p>
            )}
          </div>
        )}
      </div>

      {/* Author Refinement Section */}
      {(submission.refinementNote || ((submission.status === 'evaluated' || submission.status === 'refinement') && isOwner)) && (
        <div className="card-premium">
          <div className="flex items-center gap-2 mb-3">
            <RefreshCw className="w-4 h-4 text-sky-600" />
            <h2 className="text-base font-bold text-slate-900">Author Refinement</h2>
          </div>

          {submission.refinementNote && (
            <div className="space-y-1.5 mb-5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Latest Refinement Note</label>
              <div className="p-4 rounded-xl bg-emerald-50/40 border border-emerald-200/60 text-sm text-emerald-950 leading-relaxed whitespace-pre-line">
                {submission.refinementNote}
              </div>
            </div>
          )}

          {(submission.status === 'evaluated' || submission.status === 'refinement') && isOwner && (
            <form onSubmit={handleRefine} className="space-y-4 pt-2 border-t border-slate-100">
              <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs leading-relaxed">
                Address the expert's observations and update your technical description. Resubmitting will notify the progression reviewer and award <strong>+10 Progression Merit</strong>.
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Updated Technical Description</label>
                <textarea
                  rows="4"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Refinement Note (Explain what was improved)</label>
                <textarea
                  rows="3"
                  required
                  value={refinementNote}
                  onChange={(e) => setRefinementNote(e.target.value)}
                  placeholder="e.g. Integrated multi-point sub-metering specifications and baseline validation protocol per expert guidance..."
                  className="input-field"
                />
              </div>

              <button
                type="submit"
                disabled={refining}
                className="btn-primary"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{refining ? 'Resubmitting...' : 'Save & resubmit refined work'}</span>
              </button>
            </form>
          )}
        </div>
      )}

      {/* Progression Review Section */}
      <div className="card-premium">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-600" />
            <h2 className="text-base font-bold text-slate-900">Progression Review</h2>
          </div>
          {progressionReview && (
            <span className={`badge-pill ${
              progressionReview.decision === 'approved'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}>
              {progressionReview.decision === 'approved' ? 'Progression Validated' : 'Needs Refinement'}
            </span>
          )}
        </div>

        {progressionReview ? (
          <div className="space-y-3">
            <div className="text-xs text-slate-500">
              Evaluated by Reviewer: <strong className="text-slate-800">{submission.reviewer?.name || 'Reviewer'}</strong> on {new Date(progressionReview.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Reviewer Remarks</label>
              <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 text-sm text-slate-800 leading-relaxed whitespace-pre-line">
                {progressionReview.comments}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-sm text-slate-500 py-3">
            {submission.reviewer ? (
              <p>Assigned to Reviewer <strong className="text-slate-800">{submission.reviewer.name}</strong>. Progression assessment pending.</p>
            ) : (
              <p>Reviewer will be assigned by Administrator once refined work is submitted.</p>
            )}
          </div>
        )}
      </div>

      {/* Outcome Section */}
      {outcome ? (
        <div className="card-premium border-emerald-200/80 bg-white">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <h2 className="text-base font-bold text-slate-900">Reported Outcome &amp; Verification</h2>
            </div>
            <StatusBadge status={outcome.status} />
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Achievement Title</label>
              <div className="text-base font-bold text-slate-900">{outcome.title}</div>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Summary</label>
              <div className="text-sm text-slate-700 leading-relaxed">{outcome.description}</div>
            </div>

            {/* Document Evidence if uploaded */}
            {outcome.evidenceDocument && (
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Uploaded Evidence Document</label>
                <a
                  href={`${serverBase}${outcome.evidenceDocument}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-xs font-semibold text-emerald-900 border border-emerald-200 transition-colors"
                >
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <span>{outcome.evidenceDocumentName || 'Download Evidence File'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}

            {/* Link Evidence if provided */}
            {outcome.evidenceLink && (
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Evidence Repository Link</label>
                <a
                  href={outcome.evidenceLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700 underline"
                >
                  <span>{outcome.evidenceLink}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}

            {outcome.remark && (
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700">
                <strong>Admin Remark:</strong> {outcome.remark}
              </div>
            )}
          </div>
        </div>
      ) : (
        submission.status === 'progression_validated' && isOwner && (
          <div className="card-premium bg-gradient-to-br from-white to-teal-50/20 border-teal-200/80">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-teal-600" />
              <h2 className="text-base font-bold text-slate-900">Report Completed Outcome</h2>
            </div>
            <p className="text-xs text-slate-500 mb-5">
              Your progression has been validated! Upload tangible proof of outcome (e.g. testbed dataset, lab certificate, report document) or provide a repository link for Administrator verification (+50 Progression Merit).
            </p>

            <form onSubmit={handleReportOutcome} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Outcome Title</label>
                <input
                  type="text"
                  required
                  value={outcomeTitle}
                  onChange={(e) => setOutcomeTitle(e.target.value)}
                  placeholder="e.g. Campus Energy Baseline Validation Completed"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Outcome Description</label>
                <textarea
                  rows="3"
                  required
                  value={outcomeDescription}
                  onChange={(e) => setOutcomeDescription(e.target.value)}
                  placeholder="Detail the tangible findings, empirical dataset size, or deployment results..."
                  className="input-field"
                />
              </div>

              {/* Upload Document Evidence */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Upload Evidence Document (PDF, Report, Certificate)
                </label>

                {evidenceDocument ? (
                  <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                    <div className="flex items-center gap-2 truncate">
                      <FileText className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span className="text-xs font-semibold text-emerald-950 truncate">{evidenceDocumentName}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => { setEvidenceDocument(''); setEvidenceDocumentName(''); }}
                      className="text-slate-400 hover:text-rose-600 p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex items-center gap-2 p-3 border border-dashed border-slate-300 hover:border-brand-500 rounded-lg cursor-pointer bg-slate-50/50 hover:bg-white transition-all text-xs text-slate-600">
                    <Upload className="w-4 h-4 text-slate-400" />
                    <span>{uploadingEvidence ? 'Uploading...' : 'Click to upload proof document (PDF, DOCX, ZIP)'}</span>
                    <input
                      type="file"
                      onChange={handleEvidenceUpload}
                      disabled={uploadingEvidence}
                      className="hidden"
                    />
                  </label>
                )}

                {uploadEvidenceError && (
                  <p className="text-xs text-rose-600 mt-1">{uploadEvidenceError}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Or Evidence Repository Link (Optional if document uploaded)
                </label>
                <input
                  type="url"
                  value={evidenceLink}
                  onChange={(e) => setEvidenceLink(e.target.value)}
                  placeholder="https://repository.college.ac.in/validation/report.pdf"
                  className="input-field"
                />
              </div>

              <button
                type="submit"
                disabled={reportingOutcome || uploadingEvidence}
                className="btn-primary"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{reportingOutcome ? 'Submitting...' : 'Report outcome for Admin verification'}</span>
              </button>
            </form>
          </div>
        )
      )}

      {/* Next Opportunity Banner */}
      {submission.nextOpportunity && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl border border-emerald-300 bg-gradient-to-r from-emerald-50 via-teal-50/60 to-emerald-50 p-6 sm:p-8 shadow-card"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                Next Opportunity Unlocked &amp; Verified
              </div>
              <div className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
                {submission.nextOpportunity}
              </div>
              <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                Recorded in your verified institutional Academic Passport. You are now credentialed to proceed to the next funding and prototyping phase.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
