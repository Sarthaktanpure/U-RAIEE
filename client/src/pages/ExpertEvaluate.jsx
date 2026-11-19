import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { Award, Save, ArrowLeft } from 'lucide-react';

export default function ExpertEvaluate() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [originality, setOriginality] = useState(4);
  const [feasibility, setFeasibility] = useState(4);
  const [impact, setImpact] = useState(4);
  const [clarity, setClarity] = useState(4);
  const [comments, setComments] = useState('');

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/submissions/${id}`);
        setSubmission(res.data.submission);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load submission for evaluation.');
      } finally {
        setLoading(false);
      }
    };
    fetchSubmission();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError('');
      await api.post(`/expert/evaluate/${id}`, {
        scores: {
          originality: Number(originality),
          feasibility: Number(feasibility),
          impact: Number(impact),
          clarity: Number(clarity)
        },
        comments
      });
      navigate(`/submissions/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit evaluation.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="card-premium text-center py-16 text-slate-500 text-sm">
        Loading evaluation dossier...
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="card-premium text-center py-12 text-rose-600 text-sm">
        Submission dossier not found.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="card-premium">
        <div className="pb-5 border-b border-slate-100 mb-6">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">
            <Award className="w-3.5 h-3.5" />
            <span>Structured Assessment</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Expert Technical Evaluation Form
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Score the submission across the 4 standard criteria and provide actionable feedback (+15 Contribution Recognition).
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs">
            {error}
          </div>
        )}

        {/* Work dossier */}
        <div className="p-5 rounded-xl bg-slate-50/70 border border-slate-200 mb-6 space-y-2">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Work Under Assessment</div>
          <h2 className="text-base font-bold text-slate-900">{submission.title}</h2>
          <div className="text-xs text-slate-500">
            Author: <strong>{submission.owner?.name}</strong> ({submission.owner?.institution}) &bull; Domain: <strong>{submission.domain}</strong>
          </div>
          <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-line pt-2 border-t border-slate-200/60 font-normal">
            {submission.description}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 4 Score Selects */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Originality (1 - 5)</label>
              <select value={originality} onChange={(e) => setOriginality(e.target.value)} className="input-field">
                <option value="1">1 - Minimal novelty</option>
                <option value="2">2 - Basic extension</option>
                <option value="3">3 - Moderate novelty</option>
                <option value="4">4 - Substantial originality</option>
                <option value="5">5 - Exceptional innovation</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Feasibility (1 - 5)</label>
              <select value={feasibility} onChange={(e) => setFeasibility(e.target.value)} className="input-field">
                <option value="1">1 - Highly unviable</option>
                <option value="2">2 - Serious constraints</option>
                <option value="3">3 - Achievable with effort</option>
                <option value="4">4 - Clear viable approach</option>
                <option value="5">5 - Immediate implementation</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Impact (1 - 5)</label>
              <select value={impact} onChange={(e) => setImpact(e.target.value)} className="input-field">
                <option value="1">1 - Negligible impact</option>
                <option value="2">2 - Minor localized benefit</option>
                <option value="3">3 - Measurable department impact</option>
                <option value="4">4 - Broad institutional impact</option>
                <option value="5">5 - High societal/industry impact</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Clarity (1 - 5)</label>
              <select value={clarity} onChange={(e) => setClarity(e.target.value)} className="input-field">
                <option value="1">1 - Poorly articulated</option>
                <option value="2">2 - Lacks structure</option>
                <option value="3">3 - Adequate description</option>
                <option value="4">4 - Well-structured &amp; clear</option>
                <option value="5">5 - Exemplary technical writeup</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Expert Guidance &amp; Critique</label>
            <textarea
              rows="5"
              required
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Provide constructive feedback outlining strengths, technical shortcomings, recommended calibration protocols, and specific refinement targets..."
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
              <span>{submitting ? 'Saving...' : 'Save feedback'}</span>
            </button>
            <Link to="/expert" className="btn-secondary">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
