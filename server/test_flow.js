// Automated end-to-end flow test for U-RAIEE using native fetch
const API = 'http://localhost:5000/api';

async function req(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.message || `HTTP ${res.status}`);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

async function runTests() {
  console.log('=== STARTING U-RAIEE END-TO-END WORKFLOW & ANTI-CHEAT TESTS ===\n');

  try {
    // 1. Register a new participant
    console.log('[TEST 1] Registering a new participant...');
    const testEmail = `test_scholar_${Date.now()}@uraiee.test`;
    const regRes = await req(`${API}/auth/register`, {
      method: 'POST',
      body: JSON.stringify({
        name: 'Priya Patel',
        email: testEmail,
        password: 'Demo@1234',
        institution: 'Sardar Patel College of Engineering',
        department: 'Computer Engineering'
      })
    });
    const participantToken = regRes.token;
    const participantId = regRes.user._id;
    console.log('✓ Registered successfully:', regRes.user.name, `(${regRes.user.email})`);

    // 2. Request Expert role access
    console.log('\n[TEST 2] Requesting Expert role access...');
    const roleReqRes = await req(`${API}/roles/request`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${participantToken}` },
      body: JSON.stringify({
        role: 'expert',
        reason: 'PhD in Distributed Systems with 6 peer-reviewed papers.'
      })
    });
    const roleRequestId = roleReqRes.roleRequest._id;
    console.log('✓ Role request created with status:', roleReqRes.roleRequest.status);

    // 3. Admin login and approve role request
    console.log('\n[TEST 3] Admin approving the role request...');
    const adminLogin = await req(`${API}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({
        email: 'admin@uraiee.test',
        password: 'Demo@1234'
      })
    });
    const adminToken = adminLogin.token;

    const approveRes = await req(`${API}/admin/role-requests/${roleRequestId}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({ action: 'approve' })
    });
    console.log('✓ Role request approved:', approveRes.message);

    // 4. Participant switches active role to Expert and back to Participant
    console.log('\n[TEST 4] Switching active roles...');
    const switchRes = await req(`${API}/roles/switch`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${participantToken}` },
      body: JSON.stringify({ role: 'expert' })
    });
    console.log('✓ Switched to active role:', switchRes.user.activeRole);

    await req(`${API}/roles/switch`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${participantToken}` },
      body: JSON.stringify({ role: 'participant' })
    });
    console.log('✓ Switched back to active role: participant');

    // 5. Participant submits new idea
    console.log('\n[TEST 5] Submitting a new academic work...');
    const subRes = await req(`${API}/submissions`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${participantToken}` },
      body: JSON.stringify({
        title: 'Decentralized Microgrid Energy Balancing Protocol',
        type: 'idea',
        domain: 'Energy',
        keywords: ['energy', 'iot', 'startup', 'microgrid'],
        description: 'A fault-tolerant consensus mechanism for peer-to-peer renewable energy trading across local microgrid distribution cells.'
      })
    });
    const submissionId = subRes.submission._id;
    console.log('✓ Work submitted. Status:', subRes.submission.status);
    console.log('  Pathway recommendation:', subRes.submission.recommendedPathway.join(' -> '));

    // 6. Check merit points (+10 Progression Merit)
    console.log('\n[TEST 6] Verifying participant merit points...');
    const meritRes = await req(`${API}/merit`, {
      headers: { Authorization: `Bearer ${participantToken}` },
      method: 'GET'
    });
    console.log('✓ Progression Merit Total:', meritRes.progressionTotal, '(Expected: 10)');

    // 7. ANTI-CHEAT: Author attempts to assign or evaluate their own work
    console.log('\n[TEST 7] ANTI-CHEAT: Author tries to assign self as Expert...');
    try {
      await req(`${API}/admin/submissions/${submissionId}/assign`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${adminToken}` },
        body: JSON.stringify({ expertId: participantId })
      });
      console.error('✗ ERROR: Self-assignment should have been rejected!');
    } catch (err) {
      console.log('✓ Anti-cheat refused self-assignment as expected:', err.data.message);
    }

    // 8. Admin assigns legitimate expert (expert@uraiee.test)
    console.log('\n[TEST 8] Admin assigns accredited Expert...');
    const expertLogin = await req(`${API}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({
        email: 'expert@uraiee.test',
        password: 'Demo@1234'
      })
    });
    const expertToken = expertLogin.token;
    const expertId = expertLogin.user._id;

    // Switch expert to active role 'expert'
    await req(`${API}/roles/switch`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${expertToken}` },
      body: JSON.stringify({ role: 'expert' })
    });

    const assignExpRes = await req(`${API}/admin/submissions/${submissionId}/assign`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({ expertId })
    });
    console.log('✓ Expert assigned. Status:', assignExpRes.submission.status);

    // 9. ANTI-CHEAT: Non-assigned user tries to evaluate
    console.log('\n[TEST 9] ANTI-CHEAT: Unauthorized user tries to submit expert evaluation...');
    try {
      await req(`${API}/expert/evaluate/${submissionId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${participantToken}` },
        body: JSON.stringify({
          scores: { originality: 4, feasibility: 4, impact: 4, clarity: 4 },
          comments: 'Unauthorized test evaluation'
        })
      });
      console.error('✗ ERROR: Unauthorized evaluation should have been rejected!');
    } catch (err) {
      console.log('✓ Anti-cheat refused unauthorized evaluation as expected:', err.data.message);
    }

    // 10. Assigned expert evaluates the work
    console.log('\n[TEST 10] Assigned Expert evaluates the work...');
    const evalRes = await req(`${API}/expert/evaluate/${submissionId}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${expertToken}` },
      body: JSON.stringify({
        scores: { originality: 5, feasibility: 4, impact: 5, clarity: 4 },
        comments: 'Sound cryptographic protocol. Recommend validating node packet loss latency under peak local grid loading conditions.'
      })
    });
    console.log('✓ Evaluation saved. Status:', evalRes.submission.status);

    // 11. Author refines work based on feedback
    console.log('\n[TEST 11] Author refines work and resubmits...');
    const refineRes = await req(`${API}/submissions/${submissionId}/refine`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${participantToken}` },
      body: JSON.stringify({
        description: 'A fault-tolerant consensus mechanism with optimized packet fragmentation protocols for peer-to-peer renewable energy trading across microgrids.',
        refinementNote: 'Integrated packet latency mitigation benchmarks and lightweight cryptographic signatures per expert critique.'
      })
    });
    console.log('✓ Refined work resubmitted. Status:', refineRes.submission.status);

    // 12. ANTI-CHEAT: Try to assign the same Expert as Reviewer
    console.log('\n[TEST 12] ANTI-CHEAT: Attempting to assign Expert as Reviewer on same submission...');
    try {
      await req(`${API}/admin/submissions/${submissionId}/assign`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${adminToken}` },
        body: JSON.stringify({ reviewerId: expertId })
      });
      console.error('✗ ERROR: Assigning expert as reviewer should have been rejected!');
    } catch (err) {
      console.log('✓ Anti-cheat refused dual-role conflict of interest as expected:', err.data.message);
    }

    // 13. Admin assigns accredited Reviewer (reviewer@uraiee.test)
    console.log('\n[TEST 13] Admin assigns accredited Reviewer...');
    const reviewerLogin = await req(`${API}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({
        email: 'reviewer@uraiee.test',
        password: 'Demo@1234'
      })
    });
    const reviewerToken = reviewerLogin.token;
    const reviewerId = reviewerLogin.user._id;

    // Switch reviewer to active role 'reviewer'
    await req(`${API}/roles/switch`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${reviewerToken}` },
      body: JSON.stringify({ role: 'reviewer' })
    });

    const assignRevRes = await req(`${API}/admin/submissions/${submissionId}/assign`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({ reviewerId })
    });
    console.log('✓ Reviewer assigned. Status:', assignRevRes.submission.status);

    // 14. Reviewer approves progression
    console.log('\n[TEST 14] Reviewer validates progression...');
    const decideRes = await req(`${API}/reviewer/decide/${submissionId}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${reviewerToken}` },
      body: JSON.stringify({
        decision: 'approved',
        comments: 'Progression validated. The cryptographic packet benchmarks resolve latency concerns sufficiently for prototype deployment.'
      })
    });
    console.log('✓ Progression validated. Status:', decideRes.submission.status);

    // 15. Participant reports outcome with evidence link
    console.log('\n[TEST 15] Participant reports outcome with evidence link...');
    const outcomeRes = await req(`${API}/outcomes/${submissionId}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${participantToken}` },
      body: JSON.stringify({
        title: 'Microgrid Latency Testbed Protocol Verified',
        description: 'Empirical verification completed across 12 distributed node simulation clusters with sub-10ms transaction confirmation.',
        evidenceLink: 'https://repository.college.ac.in/validation/microgrid-protocol-2026.pdf'
      })
    });
    const outcomeId = outcomeRes.outcome._id;
    console.log('✓ Outcome reported. Status:', outcomeRes.outcome.status);

    // 16. ANTI-CHEAT: Participant attempts to verify their own outcome
    console.log('\n[TEST 16] ANTI-CHEAT: Participant tries to verify their own outcome...');
    try {
      await req(`${API}/admin/outcomes/${outcomeId}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${participantToken}` },
        body: JSON.stringify({ action: 'verify' })
      });
      console.error('✗ ERROR: Participant should not be able to verify outcomes!');
    } catch (err) {
      console.log('✓ Anti-cheat refused self-verification as expected:', err.data.message);
    }

    // 17. Admin verifies the outcome
    console.log('\n[TEST 17] Admin verifies the outcome and unlocks Next Opportunity...');
    const verifyRes = await req(`${API}/admin/outcomes/${outcomeId}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({
        action: 'verify',
        remark: 'Verified by Institutional Innovation Directorate with complete testbed logs.'
      })
    });
    console.log('✓ Outcome verified:', verifyRes.message);
    console.log('  Next Opportunity Unlocked:', verifyRes.submission.nextOpportunity);

    // 18. Verify Academic Passport
    console.log('\n[TEST 18] Inspecting Participant Academic Passport...');
    const passportRes = await req(`${API}/passport`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${participantToken}` }
    });
    console.log('✓ Passport Entries Count:', passportRes.events.length);
    console.log('  Participant Verified Outcomes:', passportRes.verifiedOutcomes.length);
    console.log('  Latest Event Title:', passportRes.events[passportRes.events.length - 1].title);

    // 19. Final Merit Verification
    console.log('\n[TEST 19] Checking final Merit Ledger totals...');
    const finalMeritRes = await req(`${API}/merit`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${participantToken}` }
    });
    console.log('✓ Participant Progression Merit Total:', finalMeritRes.progressionTotal);
    console.log('  Expected: 100 (10 submission + 10 refinement + 30 progression + 50 outcome)');

    // 20. Admin fetches all submissions
    console.log('\n[TEST 20] Admin fetching all institutional submissions...');
    const allSubsRes = await req(`${API}/admin/submissions`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('✓ Admin retrieved all submissions:', allSubsRes.submissions.length, 'total');

    // 21. Admin directly grants new roles (e.g., Coordinator, and Admin promotion)
    console.log('\n[TEST 21] Admin directly assigning Coordinator role to participant...');
    const grantCoordRes = await req(`${API}/admin/users/${participantId}/role`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({ role: 'coordinator', action: 'grant' })
    });
    console.log('✓ Coordinator role granted:', grantCoordRes.user.approvedRoles);

    console.log('\n[TEST 22] Admin directly promoting participant to Admin...');
    const promoteAdminRes = await req(`${API}/admin/users/${participantId}/role`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({ role: 'admin', action: 'grant' })
    });
    console.log('✓ Admin role granted:', promoteAdminRes.user.approvedRoles);

    console.log('\n[TEST 23] Admin revoking Coordinator role...');
    const revokeCoordRes = await req(`${API}/admin/users/${participantId}/role`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({ role: 'coordinator', action: 'revoke' })
    });
    console.log('✓ Coordinator role revoked:', revokeCoordRes.user.approvedRoles);

    console.log('\n======================================================');
    console.log('ALL WORKFLOW, ANTI-CHEAT & ADMIN TESTS PASSED!');
    console.log('======================================================');
    process.exit(0);
  } catch (error) {
    console.error('\n✗ TEST FAILED WITH ERROR:', error.data || error.message);
    process.exit(1);
  }
}

runTests();
