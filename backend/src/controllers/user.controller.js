const User = require('../models/User');

const getAllUsers = async (req, res) => {
  try {
    const { role, isActive, search, page = 1, limit = 100 } = req.query;
    const query = {};

    if (role && role !== 'All') query.role = role;
    if (isActive !== undefined && isActive !== '') query.isActive = isActive === 'true';
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: users,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role = 'Customer',
      phone,
      specializations,
      experience,
      workingHours,
      workingDays,
      commissionRate,
      bio,
      isActive = true,
      address,
    } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    const parsedSpecializations = Array.isArray(specializations)
      ? specializations
      : (typeof specializations === 'string' && specializations.trim()
        ? specializations.split(',').map(s => s.trim()).filter(Boolean)
        : []);

    const user = await User.create({
      name,
      email,
      password: password || '123456',
      role,
      phone,
      specializations: parsedSpecializations,
      experience: experience !== undefined && experience !== '' ? Number(experience) : 0,
      workingHours: workingHours || { start: '09:00', end: '18:00' },
      workingDays: workingDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      commissionRate: commissionRate !== undefined && commissionRate !== '' ? Number(commissionRate) : 0,
      bio: bio || '',
      isActive: isActive !== undefined ? isActive : true,
      address,
    });

    res.status(201).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const {
      name,
      email,
      role,
      phone,
      isActive,
      specializations,
      experience,
      workingHours,
      workingDays,
      commissionRate,
      bio,
      address,
    } = req.body;

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (role !== undefined) updateData.role = role;
    if (phone !== undefined) updateData.phone = phone;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (specializations !== undefined) {
      updateData.specializations = Array.isArray(specializations)
        ? specializations
        : (typeof specializations === 'string'
          ? specializations.split(',').map(s => s.trim()).filter(Boolean)
          : []);
    }
    if (experience !== undefined && experience !== '') updateData.experience = Number(experience);
    if (workingHours !== undefined) updateData.workingHours = workingHours;
    if (workingDays !== undefined) updateData.workingDays = workingDays;
    if (commissionRate !== undefined && commissionRate !== '') updateData.commissionRate = Number(commissionRate);
    if (bio !== undefined) updateData.bio = bio;
    if (address !== undefined) updateData.address = address;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getBarbers = async (req, res) => {
  try {
    const { specialization, search } = req.query;
    const query = { role: 'Barber', isActive: true };

    if (specialization) {
      query.specializations = { $in: [specialization] };
    }
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const barbers = await User.find(query).select('name specializations experience workingHours workingDays avatar bio commissionRate');

    res.json({ success: true, data: barbers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAllUsers, getUserById, createUser, updateUser, deleteUser, getBarbers };
