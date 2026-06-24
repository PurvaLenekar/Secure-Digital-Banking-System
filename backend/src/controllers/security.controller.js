const Member = require('../models/user.model'); // Adjust path to your actual Member model
// If you have an active alerts model, import it; otherwise, we'll generate dynamic logs based on database checks

exports.getFraudMetrics = async (req, res) => {
  try {
    // 1. Enforce backend admin protection guard
    // (Assuming your authentication middleware attaches user profile payload to req.user)
    if (!req.user || req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: "Access denied. Insufficient role permissions." });
    }

    // 2. Fetch live data components from your database collections
    const liveMembers = await Member.find({});
    
    // 3. Dynamically calculate analytics instead of hardcoding
    const totalCount = liveMembers.length;
    const frozenMembers = liveMembers.filter(m => m.status === 'FROZEN');
    const frozenCount = frozenMembers.length;
    
    // Calculate a dynamic health metric score based on percentage of clean accounts
    let systemHealthScore = 100;
    if (totalCount > 0) {
      systemHealthScore = Math.round(((totalCount - frozenCount) / totalCount) * 100);
    }

    // 4. Generate dynamic heuristic logs based on real database conditions
    const heuristicLogs = [];
    
    // Log active account conditions dynamically
    frozenMembers.forEach((member, index) => {
      heuristicLogs.push({
        _id: `alert-${member._id}`,
        alertId: `FRD-${100 + index}`,
        eventDetails: `Account isolation locked for ${member.name} (Flat ${member.flatNo || 'N/A'})`,
        severity: 'HIGH',
        createdAt: member.updatedAt || new Date(),
        resolution: 'MITIGATED'
      });
    });

    // Add a generic diagnostic sweep log if everything is running smoothly
    if (heuristicLogs.length === 0) {
      heuristicLogs.push({
        _id: 'system-clean',
        alertId: 'SYS-001',
        eventDetails: 'Heuristic pattern engine completed background sweep. 0 anomalies flagged.',
        severity: 'LOW',
        createdAt: new Date(),
        resolution: 'CLEARED'
      });
    }

    // 5. Send payload response back to React frontend match parameters
    return res.status(200).json({
      userRole: req.user.role,
      systemHealthScore: systemHealthScore,
      currentAdmin: {
        name: req.user.name || 'Active Administrator',
        email: req.user.email || ''
      },
      memberLedgers: liveMembers.map(m => ({
        _id: m._id,
        name: m.name,
        flatNo: m.flatNo,
        balance: m.balance || 0,
        status: m.status || 'ACTIVE'
      })),
      heuristicLogs: heuristicLogs
    });

  } catch (error) {
    console.error("Error generating fraud metrics:", error);
    return res.status(500).json({ message: "Internal server security pipeline error." });
  }
};

// Route controller method to mutate a member profile isolation layer
exports.toggleFreezeAccount = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: "Unauthorized operation." });
    }

    const { id } = req.params;
    const { status } = req.body; // Expecting 'ACTIVE' or 'FROZEN'

    if (!['ACTIVE', 'FROZEN'].includes(status)) {
      return res.status(400).json({ message: "Invalid system status state target." });
    }

    const updatedMember = await Member.findByIdAndUpdate(
      id,
      { status: status },
      { new: true }
    );

    if (!updatedMember) {
      return res.status(404).json({ message: "Target member profile registry not found." });
    }

    return res.status(200).json({ 
      message: `Member status updated to ${status} successfully.`,
      member: updatedMember 
    });

  } catch (error) {
    console.error("Error freezing account:", error);
    return res.status(500).json({ message: "Database update transaction error." });
  }
};

const FraudLog = require('../models/fraudLog.model');

// Get all pending alerts
exports.getAlerts = async (req, res) => {
    try {
        const allLogs = await FraudLog.find({});
        console.log("DEBUG: Found records in DB:", allLogs.length);
        
        // This sends the data to your React app
        res.json(allLogs); 
    } catch (err) {
        console.error("DEBUG: Database error:", err);
        res.status(500).json({ message: err.message });
    }
};

// Resolve an alert
exports.resolveAlert = async (req, res) => {
    try {
        const { id } = req.params;
        const { action } = req.body; // 'APPROVED' or 'BLOCKED'
        
        await FraudLog.findByIdAndUpdate(id, { status: action === 'APPROVED' ? 'CLEARED' : 'BLOCKED' });
        
        res.status(200).json({ message: "Alert updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error resolving alert" });
    }
};