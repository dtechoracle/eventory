'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import GateScannerModal from '../../components/GateScannerModal';
import CreateEventModal from '../../components/CreateEventModal';
import { useEventory } from '../../context/EventoryContext';
import { formatNaira } from '../../lib/utils';
import { WorkspaceGuest, WorkspaceTask, WorkspaceInvoice, WorkspaceQuote, EventItem } from '../../types';
import { 
  Layers, Users, CheckSquare, Receipt, MessageSquare, Plus, CheckCircle2, 
  Clock, DollarSign, ShieldCheck, QrCode, FileText, ChevronRight, Check, 
  Download, ArrowLeft, Settings, Search, Filter, AlertCircle, Calendar, 
  Send, Sparkles, Building2, Briefcase, MapPin, X
} from 'lucide-react';

export default function OrganiserDashboardPage() {
  const { 
    workspace, events, checkInGuest, updateGuestCheckInStatus, 
    addWorkspaceTask, toggleWorkspaceTask, approveQuote, payMilestone, 
    sendTeamMessage, createEvent 
  } = useEventory();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'guests' | 'tasks' | 'vendors' | 'invoices' | 'chat' | 'documents'
  >('overview');

  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Submodule states
  const [guestSearch, setGuestSearch] = useState('');
  const [guestFilter, setGuestFilter] = useState<'all' | 'checked_in' | 'awaiting'>('all');

  // Task form
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState<WorkspaceTask['category']>('Logistics');
  const [newTaskAssignee, setNewTaskAssignee] = useState('Stephen (Groom)');
  const [newTaskDueDate, setNewTaskDueDate] = useState('Dec 08, 2027');
  const [isAddingTask, setIsAddingTask] = useState(false);

  // Chat
  const [chatInput, setChatInput] = useState('');

  // Milestone payment modal
  const [payingInvoice, setPayingInvoice] = useState<WorkspaceInvoice | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);

  // Calculations from actual data
  const checkedInCount = workspace.guests.filter((g) => g.checkedIn).length;
  const totalGuestsCount = workspace.guests.length;
  const completedTasksCount = workspace.tasks.filter((t) => t.status === 'completed').length;
  const taskProgressPercent = Math.round((completedTasksCount / (workspace.tasks.length || 1)) * 100);

  const filteredGuests = workspace.guests.filter((g) => {
    const q = guestSearch.toLowerCase().trim();
    const matchSearch = !q || g.name.toLowerCase().includes(q) || g.ticketCode.toLowerCase().includes(q) || g.email.toLowerCase().includes(q);
    const matchStatus =
      guestFilter === 'all' ||
      (guestFilter === 'checked_in' && g.checkedIn) ||
      (guestFilter === 'awaiting' && !g.checkedIn);
    return matchSearch && matchStatus;
  });

  const handleTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    addWorkspaceTask({
      title: newTaskTitle,
      category: newTaskCategory,
      assignee: newTaskAssignee,
      dueDate: newTaskDueDate,
      priority: 'high'
    });
    setNewTaskTitle('');
    setIsAddingTask(false);
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    sendTeamMessage(chatInput);
    setChatInput('');
  };

  const handleConfirmMilestonePayment = () => {
    if (payingInvoice && paymentAmount > 0) {
      payMilestone(payingInvoice.id, paymentAmount);
      setPayingInvoice(null);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans w-full overflow-x-hidden">
      <Navbar onOpenGateScanner={() => setIsScannerOpen(true)} onOpenCreateEvent={() => setIsCreateModalOpen(true)} />

      {/* Sleek Workspace Header (Clean, restrained, matching Tix/Linear aesthetic) */}
      <div className="border-b border-slate-100 bg-white py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="w-2 h-2 rounded-full bg-[#8ec82d]"></span>
                <span className="font-bold text-[#301d6e] uppercase tracking-wider text-[10px]">Active Event Workspace</span>
                <span className="text-slate-300">•</span>
                <span className="flex items-center gap-1 font-medium">
                  <MapPin className="w-3 h-3 text-slate-400" /> Abuja, Nigeria
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {workspace.title}
              </h1>
              <p className="text-xs text-slate-500 flex items-center gap-2 pt-0.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{workspace.eventDate}</span>
                <span className="text-slate-300">•</span>
                <span>The Dome, Central Business District, Abuja</span>
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setIsScannerOpen(true)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white text-slate-800 text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5"
              >
                <QrCode className="w-4 h-4 text-[#301d6e]" />
                <span>Gate Scanner ({checkedInCount}/{totalGuestsCount})</span>
              </button>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-[#301d6e] hover:bg-[#20134e] text-white text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4 text-[#8ec82d]" />
                <span>New Event</span>
              </button>
            </div>

          </div>

          {/* Clean Metric Ribbon (Single flat row with subtle dividers instead of chunky cards) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-5 mt-6 border-y border-slate-100 text-xs">
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-slate-400">Guest Attendance</span>
              <div className="flex items-baseline gap-1.5">
                <strong className="text-lg font-black text-slate-900">{checkedInCount}</strong>
                <span className="text-slate-500">/ {totalGuestsCount} registered ({Math.round((checkedInCount / (totalGuestsCount || 1)) * 100)}%)</span>
              </div>
            </div>

            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-slate-400">Tasks Checklist</span>
              <div className="flex items-baseline gap-1.5">
                <strong className="text-lg font-black text-slate-900">{completedTasksCount}</strong>
                <span className="text-slate-500">/ {workspace.tasks.length} done ({taskProgressPercent}%)</span>
              </div>
            </div>

            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-slate-400">Escrow Paid</span>
              <div className="flex items-baseline gap-1.5">
                <strong className="text-lg font-black text-emerald-600">{formatNaira(workspace.totalPaid)}</strong>
                <span className="text-slate-500">funded</span>
              </div>
            </div>

            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-slate-400">Verified Vendors</span>
              <div className="flex items-baseline gap-1.5">
                <strong className="text-lg font-black text-slate-900">{workspace.bookedVendors}</strong>
                <span className="text-slate-500">active contracts</span>
              </div>
            </div>
          </div>

          {/* Clean Horizontal Tab Navigation */}
          <div className="flex items-center gap-1 overflow-x-auto pt-3 scrollbar-none">
            {[
              { id: 'overview', label: 'Overview', icon: Layers },
              { id: 'guests', label: 'Guests & Check-in', icon: Users, badge: `${checkedInCount}/${totalGuestsCount}` },
              { id: 'tasks', label: 'Tasks', icon: CheckSquare, badge: `${completedTasksCount}/${workspace.tasks.length}` },
              { id: 'vendors', label: 'Vendors & Bookings', icon: Briefcase, badge: String(workspace.bookedVendors) },
              { id: 'invoices', label: 'Invoices & Escrow', icon: Receipt },
              { id: 'chat', label: 'Team Chat', icon: MessageSquare },
              { id: 'documents', label: 'Documents', icon: FileText, badge: String(workspace.documents.length) }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${
                    isActive
                      ? 'bg-[#301d6e] text-white'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#8ec82d]' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                      isActive ? 'bg-[#8ec82d] text-[#1e1144]' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

        </div>
      </div>

      {/* Main Tab Workspace */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        
        {/* 1. OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Task Progress (Clean, restrained) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-slate-900">Immediate Tasks</h3>
                  <button onClick={() => setActiveTab('tasks')} className="text-xs font-bold text-[#301d6e] hover:underline">
                    View all tasks ({workspace.tasks.length})
                  </button>
                </div>

                <div className="border border-slate-100 rounded-2xl divide-y divide-slate-100 overflow-hidden bg-white">
                  {workspace.tasks.slice(0, 4).map((task) => (
                    <div
                      key={task.id}
                      onClick={() => toggleWorkspaceTask(task.id)}
                      className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded border flex items-center justify-center ${task.status === 'completed' ? 'bg-[#8ec82d] border-[#8ec82d]' : 'border-slate-300'}`}>
                          {task.status === 'completed' && <Check className="w-3 h-3 text-[#1e1144] stroke-[3]" />}
                        </div>
                        <span className={task.status === 'completed' ? 'line-through text-slate-400' : 'font-medium text-slate-900'}>
                          {task.title}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-400">{task.dueDate}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial Escrow Summary */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-slate-900">Milestone Escrow Summary</h3>
                  <button onClick={() => setActiveTab('invoices')} className="text-xs font-bold text-[#301d6e] hover:underline">
                    Manage Invoices
                  </button>
                </div>

                <div className="border border-slate-100 rounded-2xl p-4 bg-slate-50/50 space-y-3 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Contracted Budget:</span>
                    <strong className="text-slate-900 text-sm font-black">{formatNaira(workspace.totalBudget)}</strong>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Funded in Escrow:</span>
                    <strong className="text-emerald-600 text-sm font-black">{formatNaira(workspace.totalPaid)}</strong>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Pending Milestone Balance:</span>
                    <strong className="text-amber-600 text-sm font-black">{formatNaira(workspace.totalOutstanding)}</strong>
                  </div>
                  <div className="pt-2">
                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.round((workspace.totalPaid / (workspace.totalBudget || 1)) * 100)}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Recent Guest Check-ins Ribbon */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900">Recent Guest Arrivals</h3>
                <button onClick={() => setActiveTab('guests')} className="text-xs font-bold text-[#301d6e] hover:underline">
                  Full Guest List
                </button>
              </div>

              <div className="border border-slate-100 rounded-2xl overflow-hidden bg-white">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 uppercase font-bold text-[10px]">
                    <tr>
                      <th className="py-2.5 px-4">Guest Name</th>
                      <th className="py-2.5 px-4">Table / Tier</th>
                      <th className="py-2.5 px-4">Ticket Code</th>
                      <th className="py-2.5 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {workspace.guests.slice(0, 4).map((g) => (
                      <tr key={g.id} className="hover:bg-slate-50">
                        <td className="py-2.5 px-4 font-bold text-slate-900">{g.name}</td>
                        <td className="py-2.5 px-4 text-slate-600">{g.tableNumber || g.ticketType}</td>
                        <td className="py-2.5 px-4 font-mono font-bold text-[#301d6e]">{g.ticketCode}</td>
                        <td className="py-2.5 px-4">
                          {g.checkedIn ? (
                            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold text-[10px]">
                              Admitted
                            </span>
                          ) : (
                            <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-bold text-[10px]">
                              Awaiting
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* 2. GUESTS TAB */}
        {activeTab === 'guests' && (
          <div className="space-y-4">
            
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={guestSearch}
                  onChange={(e) => setGuestSearch(e.target.value)}
                  placeholder="Search guest by name or ticket code..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#301d6e]"
                />
              </div>

              <div className="flex items-center gap-1.5 text-xs">
                <button
                  onClick={() => setGuestFilter('all')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${guestFilter === 'all' ? 'bg-[#301d6e] text-white' : 'bg-slate-100 text-slate-600'}`}
                >
                  All ({totalGuestsCount})
                </button>
                <button
                  onClick={() => setGuestFilter('checked_in')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${guestFilter === 'checked_in' ? 'bg-[#8ec82d] text-[#1e1144]' : 'bg-slate-100 text-slate-600'}`}
                >
                  Admitted ({checkedInCount})
                </button>
                <button
                  onClick={() => setGuestFilter('awaiting')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${guestFilter === 'awaiting' ? 'bg-amber-100 text-amber-900' : 'bg-slate-100 text-slate-600'}`}
                >
                  Awaiting ({totalGuestsCount - checkedInCount})
                </button>
              </div>
            </div>

            <div className="border border-slate-200 rounded-2xl overflow-x-auto bg-white">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase font-bold text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Attendee</th>
                    <th className="py-3 px-4">Contact</th>
                    <th className="py-3 px-4">Tier / Table</th>
                    <th className="py-3 px-4">Ticket Code</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Gate Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredGuests.map((g) => (
                    <tr key={g.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900">{g.name}</td>
                      <td className="py-3 px-4 text-slate-600">{g.phone}</td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-[#301d6e]">{g.ticketType}</span>
                        <div className="text-[10px] text-slate-400">{g.tableNumber}</div>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-700">{g.ticketCode}</td>
                      <td className="py-3 px-4">
                        {g.checkedIn ? (
                          <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[10px]">
                            Checked In ({g.checkInTime || 'Gate 1'})
                          </span>
                        ) : (
                          <span className="text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded text-[10px]">
                            Awaiting Arrival
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => updateGuestCheckInStatus(g.id, !g.checkedIn)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                            g.checkedIn ? 'bg-slate-100 text-slate-600 hover:bg-rose-50' : 'bg-[#8ec82d] text-[#1e1144]'
                          }`}
                        >
                          {g.checkedIn ? 'Revoke' : 'Admit'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* 3. TASKS TAB */}
        {activeTab === 'tasks' && (
          <div className="space-y-4">
            
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">
                {completedTasksCount} of {workspace.tasks.length} Completed
              </span>
              <button
                onClick={() => setIsAddingTask(!isAddingTask)}
                className="px-3.5 py-1.5 bg-[#301d6e] text-white rounded-xl text-xs font-bold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5 text-[#8ec82d]" />
                <span>{isAddingTask ? 'Cancel' : 'Add Task'}</span>
              </button>
            </div>

            {isAddingTask && (
              <form onSubmit={handleTaskSubmit} className="p-4 bg-purple-50/60 rounded-2xl border border-purple-100 space-y-3">
                <input
                  type="text"
                  required
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="Task title (e.g. Confirm audio technician setup)"
                  className="w-full p-2.5 bg-white rounded-xl text-xs border border-slate-200"
                />
                <div className="flex justify-end gap-2">
                  <button type="submit" className="px-4 py-1.5 bg-[#301d6e] text-white rounded-xl text-xs font-bold">
                    Save Task
                  </button>
                </div>
              </form>
            )}

            <div className="border border-slate-200 rounded-2xl divide-y divide-slate-100 overflow-hidden bg-white">
              {workspace.tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => toggleWorkspaceTask(task.id)}
                  className={`p-3.5 flex items-center justify-between cursor-pointer transition-colors ${
                    task.status === 'completed' ? 'bg-slate-50/50 text-slate-400' : 'hover:bg-slate-50 text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded border flex items-center justify-center ${task.status === 'completed' ? 'bg-[#8ec82d] border-[#8ec82d]' : 'border-slate-300'}`}>
                      {task.status === 'completed' && <Check className="w-3 h-3 text-[#1e1144] stroke-[3]" />}
                    </div>
                    <span className={`text-xs font-medium ${task.status === 'completed' ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                      {task.title}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">{task.dueDate}</span>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* 4. VENDORS TAB */}
        {activeTab === 'vendors' && (
          <div className="space-y-4">
            <div className="space-y-3">
              {workspace.quotes.map((q) => (
                <div key={q.id} className="p-4 bg-white rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{q.vendorName}</span>
                      <span className="text-[10px] bg-purple-50 text-[#301d6e] px-2 py-0.5 rounded font-bold">{q.category}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{q.details}</p>
                  </div>
                  <div className="text-left sm:text-right shrink-0">
                    <span className="text-base font-black text-[#301d6e] block">{formatNaira(q.quotedAmount)}</span>
                    {q.status === 'approved' ? (
                      <span className="text-emerald-700 text-xs font-bold">Approved & Contracted</span>
                    ) : (
                      <button
                        onClick={() => approveQuote(q.id)}
                        className="mt-1 px-3 py-1 bg-[#8ec82d] text-[#1e1144] text-xs font-bold rounded-lg"
                      >
                        Approve Quote
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. INVOICES & ESCROW TAB */}
        {activeTab === 'invoices' && (
          <div className="space-y-4">
            <div className="border border-slate-200 rounded-2xl overflow-x-auto bg-white">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase font-bold text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Invoice #</th>
                    <th className="py-3 px-4">Vendor & Service</th>
                    <th className="py-3 px-4">Total Amount</th>
                    <th className="py-3 px-4">Paid Escrow</th>
                    <th className="py-3 px-4">Balance</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {workspace.invoices.map((inv) => {
                    const bal = inv.amount - inv.paidAmount;
                    return (
                      <tr key={inv.id} className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-mono font-bold text-slate-700">{inv.invoiceNumber}</td>
                        <td className="py-3 px-4 font-bold text-slate-900">{inv.vendorName}</td>
                        <td className="py-3 px-4 font-bold">{formatNaira(inv.amount)}</td>
                        <td className="py-3 px-4 text-emerald-600 font-bold">{formatNaira(inv.paidAmount)}</td>
                        <td className="py-3 px-4 text-amber-600 font-bold">{formatNaira(bal)}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">{inv.status}</span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          {bal > 0 ? (
                            <button
                              onClick={() => { setPayingInvoice(inv); setPaymentAmount(bal); }}
                              className="px-3 py-1 bg-[#301d6e] text-white rounded-lg text-xs font-bold"
                            >
                              Release Milestone
                            </button>
                          ) : (
                            <span className="text-emerald-600 font-bold">Settled</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Milestone Payment Modal */}
            {payingInvoice && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
                <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4 border border-slate-100 shadow-xl">
                  <h4 className="font-bold text-slate-900">Authorize Milestone Escrow</h4>
                  <p className="text-xs text-slate-600">Releasing payment to <strong>{payingInvoice.vendorName}</strong>.</p>
                  <div>
                    <label className="text-xs font-bold text-slate-700">Amount (₦)</label>
                    <input
                      type="number"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(Number(e.target.value))}
                      className="w-full p-2.5 bg-slate-50 border rounded-xl text-sm font-bold mt-1"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button onClick={() => setPayingInvoice(null)} className="px-3 py-2 text-xs text-slate-600">Cancel</button>
                    <button onClick={handleConfirmMilestonePayment} className="px-4 py-2 bg-[#8ec82d] text-[#1e1144] text-xs font-bold rounded-xl">
                      Confirm Payout
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 6. TEAM CHAT TAB */}
        {activeTab === 'chat' && (
          <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white flex flex-col h-[500px]">
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {workspace.chatMessages.map((msg) => (
                <div key={msg.id} className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full ${msg.avatarColor} text-white font-bold text-xs flex items-center justify-center shrink-0`}>
                    {msg.sender.charAt(0)}
                  </div>
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 max-w-xl text-xs space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{msg.sender}</span>
                      <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                    </div>
                    <p className="text-slate-700">{msg.message}</p>
                  </div>
                </div>
              ))}
            </div>
            <form onSubmit={handleChatSubmit} className="p-3 bg-slate-50 border-t border-slate-200 flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type team announcement or update..."
                className="flex-1 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none"
              />
              <button type="submit" className="px-4 py-2 bg-[#301d6e] text-white rounded-xl text-xs font-bold">
                Send
              </button>
            </form>
          </div>
        )}

        {/* 7. DOCUMENTS TAB */}
        {activeTab === 'documents' && (
          <div className="space-y-3">
            {workspace.documents.map((doc) => (
              <div key={doc.id} className="p-4 bg-white rounded-2xl border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-[#301d6e]" />
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900">{doc.title}</h4>
                    <span className="text-[10px] text-slate-400">{doc.category} • {doc.size} • Updated {doc.updatedDate}</span>
                  </div>
                </div>
                <button onClick={() => alert(`Downloading ${doc.title}`)} className="px-3 py-1.5 text-xs font-bold text-[#301d6e] bg-purple-50 rounded-xl">
                  Download
                </button>
              </div>
            ))}
          </div>
        )}

      </main>

      <Footer />

      {/* Gate Scanner */}
      {isScannerOpen && (
        <GateScannerModal
          isOpen={isScannerOpen}
          onClose={() => setIsScannerOpen(false)}
          guests={workspace.guests}
          onCheckInGuest={checkInGuest}
        />
      )}

      {/* Create Event Modal */}
      {isCreateModalOpen && (
        <CreateEventModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onEventCreated={(ev) => {
            createEvent(ev);
            setIsCreateModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
