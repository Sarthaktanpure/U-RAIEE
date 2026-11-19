import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { CheckCircle2, Save, ArrowLeft } from 'lucide-react';

export default function ReviewerDecide() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [decision, setDecision] = useState('approved');
  const [comments, setComments] = useState('');

  useEffect(() => {
    const fetchDossier = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/submissions/${id}`);
        setData(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load submission dossier.');
      } finally {
        setLoading(false);
      }
    };
    fetchDossier();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError('');
      await api.post(`/reviewer/decide/${id}`, {
        decision,
        comments
      });
      navigate(`/submissions/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit progression decision.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="card-premium text-center py-16 text-slate-500 text-sm">
        Loading progression assessment dossier...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="card-premium text-center py-12 text-rose-600 text-sm">
        Submission dossier not found.
      </div>
    );
  }

  const { submission, reviews } = data;
  const expertReview = reviews.find(r => r.kind === 'expert');

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="card-premium">
        <div className="pb-5 border-b border-slate-100 mb-6">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-600 uppercase tracking-wider mb-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Independent Validation</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Progression Review Decision
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Validate whether the refined work resolves expert critique and qualifies for pathway advancement.
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs">
            {error}
          </div>
        )}

        {/* Work Dossier */}
        <div className="p-5 rounded-xl bg-slate-50/70 border border-slate-200 mb-5 space-y-2">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Submission Overview</div>
          <h2 className="text-base font-bold text-slate-900">{submission.title}</h2>
          <div className="text-xs text-slate-500">
            Author: <strong>{submission.owner?.name}</strong> &bull; Stage: <strong>{submission.stage}</strong>
          </div>
          <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-line pt-2 border-t border-slate-200/60 font-normal">
            {submission.description}
          </div>
        </div>

        {/* Expert Assessment Summary */}
        {expertReview && (
          <div className="p-4 rounded-xl bg-white border border-slate-200 mb-5 space-y-2">
            <div className="text-xs font-bold text-brand-900 uppercase tracking-wide">
              Expert Technical Assessment
            </div>
            <div className="text-xs text-slate-500">
              Scores: Originality ({expertReview.scores?.originality}/5), Feasibility ({expertReview.scores?.feasibility}/5), Impact ({expertReview.scores?.impact}/5), Clarity ({expertReview.scores?.clarity}/5)
            </div>
            <div className="text-xs text-slate-700 italic bg-slate-50 p-3 rounded-lg border border-slate-200/60 leading-relaxed">
              &ldquo;{expertReview.comments}&rdquo;
            </div>
          </div>
        )}

        {/* Author Refinement Note */}
        {submission.refinementNote && (
          <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200 mb-6 space-y-1.5">
            <div className="text-xs font-bold text-emerald-900 uppercase tracking-wide">
              Author Refinement Note (Changes Implemented)
            </div>
            <div className="text-xs text-emerald-950 leading-relaxed">
              {submission.refinementNote}
            </div>
          </div>
        )}

        {/* Decision Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">Progression Decision</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className={`cursor-pointer p-4 rounded-xl border flex items-start gap-3 transition-all ${
                decision === 'approved'
                  ? 'border-emerald-500 bg-emerald-50/40 ring-2 ring-emerald-500/10'
                  : 'border-slate-200 bg-white hover:bg-slate-50/70'
              }`}>
                <input
                  type="radio"
                  name="decision"
                  value="approved"
                  checked={decision === 'approved'}
                  onChange={() => setDecision('approved')}
                  className="mt-1"
                />
                <div>
                  <div className="text-sm font-semibold text-slate-900">Approve Progression</div>
                  <div className="text-xs text-slate-500 mt-0.5">+30 Participant Merit, +15 Reviewer Merit</div>
                </div>
              </label>

              <label className={`cursor-pointer p-4 rounded-xl border flex items-start gap-3 transition-all ${
                decision === 'needs_work'
                  ? 'border-amber-500 bg-amber-50/40 ring-2 ring-amber-500/10'
                  : 'border-slate-200 bg-white hover:bg-slate-50/70'
              }`}>
                <input
                  type="radio"
                  name="decision"
                  value="needs_work"
                  checked={decision === 'needs_work'}
                  onChange={() => setDecision('needs_work')}
                  className="mt-1"
                />
                <div>
                  <div className="text-sm font-semibold text-slate-900">Request Further Refinement</div>
                  <div className="text-xs text-slate-500 mt-0.5">Returns work back to author for adjustments</div>
                </div>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Reviewer Remarks &amp; Progression Rationale</label>
            <textarea
              rows="4"
              required
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="State the academic justification for your progression decision..."
              className="input-field"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary"
            >
              <Save className="w-4 h-4" />
              <span>{submitting ? 'Recording decision...' : 'Save decision'}</span>
            </button>
            <Link to="/reviewer" className="btn-secondary">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
