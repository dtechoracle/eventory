'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import GateScannerModal from '../../../components/GateScannerModal';
import { useEventory } from '../../../context/EventoryContext';
import { formatNaira } from '../../../lib/utils';
import { WorkspaceGuest, WorkspaceTask, WorkspaceInvoice, WorkspaceQuote } from '../../../types';
import { 
  Layers, Users, CheckSquare, Receipt, MessageSquare, Plus, CheckCircle2, 
  Clock, DollarSign, ShieldCheck, QrCode, FileText, ChevronRight, Check, 
  Download, Settings, Search, Filter, AlertCircle, Calendar, 
  Send, Sparkles, Building2, Briefcase, MapPin, X
} from 'lucide-react';

export default function DashboardWorkspacePage() {
  const { 
    workspace, checkInGuest, updateGuestCheckInStatus, 
    addWorkspaceTask, toggleWorkspaceTask, approveQuote, payMilestone, 
    sendTeamMessage, showToast 
  } = useEventory();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'guests' | 'tasks' | 'vendors' | 'invoices' | 'chat'
  >('overview');

  const [isScannerOpen, setIsScannerOpen] = useState(false);

  // Submodule states
  const [guestSearch, setGuestSearch] = useState('');
  const [guestFilter, setGuestFilter] = useState<'all' | 'checked_in' | 'awaiting'>('all');

  // Task form
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState<WorkspaceTask['category']>('Logistics');
  const [newTaskAssignee, setNewTaskAssignee] = useState('Stephen');
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
    showToast('✓ Task added to operational checklist');
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
      showToast(`✓ Milestone payment of ${formatNaira(paymentAmount)} released from Escrow!`);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        
        {/* Workspace Title & Meta */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="w-2 h-2 rounded-full bg-[#8ec82d]"></span>
              <span className="font-bold text-[#301d6e] uppercase tracking-wider text-[10px]">Active Event Workspace</span>
              <span className="text-slate-300">•</span>
              <span className="flex items-center gap-1 font-medium">
                <MapPin className="w-3 h-3 text-slate-400" /> {workspace.city}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {workspace.title}
            </h1>
            <p className="text-xs text-slate-500 flex items-center gap-2 pt-0.5 font-medium">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{workspace.eventDate}</span>
              <span className="text-slate-300">•</span>
              <span>{workspace.venueName}</span>
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => setIsScannerOpen(true)}
              className="px-4 py-2 bg-[#301d6e] hover:bg-[#20134e] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
            >
              <QrCode className="w-3.5 h-3.5 text-[#8ec82d]" />
              <span>Gate Scanner</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200/80">
          {[
            { id: 'overview', label: 'Overview', icon: Layers },
            { id: 'guests', label: 'Guest Check-in', icon: Users, badge: `${checkedInCount}/${totalGuestsCount}` },
            { id: 'tasks', label: 'Checklists & Tasks', icon: CheckSquare, badge: `${completedTasksCount}/${workspace.tasks.length}` },
            { id: 'vendors', label: 'Vendor Quotes', icon: Building2, badge: String(workspace.quotes.length) },
            { id: 'invoices', label: 'Escrow Invoices', icon: Receipt },
            { id: 'chat', label: 'Team Dispatch', icon: MessageSquare, badge: `${workspace.chatMessages.length}` }
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  active
                    ? 'bg-[#301d6e] text-white shadow-2xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? 'text-[#8ec82d]' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    active ? 'bg-[#8ec82d] text-[#20134e]' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* SUBMODULE: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 space-y-1">
                <span className="text-xs font-bold text-slate-500">Gate Attendance</span>
                <div className="text-2xl font-black text-slate-900">{checkedInCount} / {totalGuestsCount}</div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
                  <div className="bg-[#8ec82d] h-full rounded-full" style={{ width: `${Math.round((checkedInCount / (totalGuestsCount || 1)) * 100)}%` }}></div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 space-y-1">
                <span className="text-xs font-bold text-slate-500">Task Readiness</span>
                <div className="text-2xl font-black text-slate-900">{taskProgressPercent}%</div>
                <span className="text-[11px] text-slate-400">{completedTasksCount} of {workspace.tasks.length} tasks resolved</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 space-y-1">
                <span className="text-xs font-bold text-slate-500">Committed Budget</span>
                <div className="text-2xl font-black text-[#301d6e]">{formatNaira(workspace.totalBudget)}</div>
                <span className="text-[11px] text-emerald-600 font-semibold">{formatNaira(workspace.totalPaid)} Paid via Escrow</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 space-y-1">
                <span className="text-xs font-bold text-slate-500">Outstanding Balance</span>
                <div className="text-2xl font-black text-amber-600">{formatNaira(workspace.totalOutstanding)}</div>
                <span className="text-[11px] text-slate-400">Due upon job delivery</span>
              </div>
            </div>

            {/* Quick action grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Task list preview */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-slate-900">Priority Milestones</h3>
                  <button onClick={() => setActiveTab('tasks')} className="text-xs text-[#301d6e] font-bold hover:underline">
                    View all
                  </button>
                </div>
                <div className="space-y-2">
                  {workspace.tasks.slice(0, 3).map((task) => (
                    <div key={task.id} className="p-3 bg-slate-50 rounded-xl flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={task.status === 'completed'}
                          onChange={() => toggleWorkspaceTask(task.id)}
                          className="w-4 h-4 rounded text-[#301d6e] cursor-pointer"
                        />
                        <span className={task.status === 'completed' ? 'line-through text-slate-400' : 'font-semibold text-slate-800'}>
                          {task.title}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-medium">{task.assignee}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Invoices preview */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-slate-900">Vendor Escrow Milestone</h3>
                  <button onClick={() => setActiveTab('invoices')} className="text-xs text-[#301d6e] font-bold hover:underline">
                    View all
                  </button>
                </div>
                <div className="space-y-2">
                  {workspace.invoices.slice(0, 3).map((inv) => (
                    <div key={inv.id} className="p-3 bg-slate-50 rounded-xl flex items-center justify-between text-xs">
                      <div>
                        <h4 className="font-bold text-slate-900">{inv.vendorName}</h4>
                        <span className="text-[10px] text-slate-500">{inv.serviceCategory}</span>
                      </div>
                      <div className="text-right">
                        <strong className="block text-slate-900">{formatNaira(inv.amount)}</strong>
                        <span className={`text-[10px] font-bold ${inv.status === 'paid' ? 'text-emerald-600' : 'text-amber-600'}`}>
                          {inv.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SUBMODULE: GUESTS */}
        {activeTab === 'guests' && (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search guest by name or ticket code..."
                  value={guestSearch}
                  onChange={(e) => setGuestSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#301d6e]"
                />
              </div>

              <div className="flex items-center gap-2">
                {(['all', 'checked_in', 'awaiting'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setGuestFilter(f)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      guestFilter === f ? 'bg-[#301d6e] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {f === 'all' ? 'All' : f === 'checked_in' ? 'Admitted' : 'Awaiting'}
                  </button>
                ))}
              </div>
            </div>

            <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
              {filteredGuests.map((guest) => (
                <div key={guest.id} className="p-4 flex items-center justify-between text-xs hover:bg-slate-50 transition-colors">
                  <div>
                    <h4 className="font-bold text-slate-900">{guest.name}</h4>
                    <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                      {guest.ticketCode} • {guest.ticketType} • Table: {guest.tableNumber || 'Main'}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {guest.checkedIn ? (
                      <span className="font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full text-[11px] flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Admitted ({guest.checkInTime || 'Gate'})
                      </span>
                    ) : (
                      <button
                        onClick={() => updateGuestCheckInStatus(guest.id, true)}
                        className="px-3.5 py-1.5 bg-[#8ec82d] hover:bg-[#76a824] text-[#1e1144] font-bold text-xs rounded-lg transition-all"
                      >
                        Check In
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUBMODULE: TASKS */}
        {activeTab === 'tasks' && (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900">Event Execution Checklist</h3>
              <button
                onClick={() => setIsAddingTask(!isAddingTask)}
                className="px-3 py-1.5 bg-[#301d6e] text-white rounded-lg text-xs font-bold"
              >
                + Add Task
              </button>
            </div>

            {isAddingTask && (
              <form onSubmit={handleTaskSubmit} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <input
                  type="text"
                  required
                  placeholder="Task title..."
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Assignee..."
                    value={newTaskAssignee}
                    onChange={(e) => setNewTaskAssignee(e.target.value)}
                    className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                  <button type="submit" className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold">
                    Save
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-2">
              {workspace.tasks.map((task) => (
                <div key={task.id} className="p-3.5 bg-slate-50 rounded-xl flex items-center justify-between text-xs border border-slate-100">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={task.status === 'completed'}
                      onChange={() => toggleWorkspaceTask(task.id)}
                      className="w-4 h-4 rounded text-[#301d6e] cursor-pointer"
                    />
                    <div>
                      <span className={task.status === 'completed' ? 'line-through text-slate-400 block font-medium' : 'font-bold text-slate-900 block'}>
                        {task.title}
                      </span>
                      <span className="text-[10px] text-slate-500">Category: {task.category} • Due: {task.dueDate}</span>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-slate-700 bg-white px-2.5 py-1 rounded-md border border-slate-200">
                    {task.assignee}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUBMODULE: VENDOR QUOTES */}
        {activeTab === 'vendors' && (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4">
            <h3 className="font-bold text-sm text-slate-900">Received Service Quotes</h3>
            <div className="space-y-3">
              {workspace.quotes.map((q) => (
                <div key={q.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <h4 className="font-bold text-slate-900">{q.vendorName}</h4>
                    <p className="text-slate-500 text-[11px]">{q.category} • Submitted: {q.submittedDate}</p>
                    <p className="text-slate-600 mt-1 italic">"{q.details}"</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <strong className="text-sm font-black text-slate-900">{formatNaira(q.quotedAmount)}</strong>
                    {q.status === 'pending' ? (
                      <button
                        onClick={() => {
                          approveQuote(q.id);
                          showToast(`✓ Quote from ${q.vendorName} approved & milestone created`);
                        }}
                        className="px-3.5 py-1.5 bg-[#301d6e] text-white font-bold rounded-lg"
                      >
                        Approve & Escrow
                      </button>
                    ) : (
                      <span className="text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded-full text-[11px]">
                        ✓ Approved
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUBMODULE: INVOICES */}
        {activeTab === 'invoices' && (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4">
            <h3 className="font-bold text-sm text-slate-900">Milestone Payment Escrow Invoices</h3>
            <div className="space-y-3">
              {workspace.invoices.map((inv) => (
                <div key={inv.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <h4 className="font-bold text-slate-900">{inv.vendorName}</h4>
                    <p className="text-slate-500 text-[11px]">{inv.serviceCategory} • Invoice #{inv.invoiceNumber} • Due: {inv.dueDate}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div>
                      <strong className="text-sm font-black text-slate-900 block">{formatNaira(inv.amount)}</strong>
                      <span className="text-[10px] text-slate-500 block">Paid: {formatNaira(inv.paidAmount)}</span>
                    </div>
                    {inv.status !== 'paid' && (
                      <button
                        onClick={() => {
                          setPayingInvoice(inv);
                          setPaymentAmount(inv.amount - inv.paidAmount);
                        }}
                        className="px-3.5 py-1.5 bg-[#8ec82d] text-[#1e1144] font-bold rounded-lg"
                      >
                        Release Deposit
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUBMODULE: CHAT */}
        {activeTab === 'chat' && (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4">
            <h3 className="font-bold text-sm text-slate-900">Operations Dispatch Channel</h3>
            <div className="space-y-3 max-h-80 overflow-y-auto p-2 border border-slate-100 rounded-xl">
              {workspace.chatMessages.map((msg) => (
                <div key={msg.id} className="p-3 bg-slate-50 rounded-xl space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#301d6e]">{msg.sender} ({msg.role})</span>
                    <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">{msg.message}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleChatSubmit} className="flex gap-2">
              <input
                type="text"
                placeholder="Broadcast dispatch message to event team..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#301d6e]"
              />
              <button type="submit" className="px-5 py-2.5 bg-[#301d6e] text-white font-bold text-xs rounded-xl cursor-pointer">
                Send
              </button>
            </form>
          </div>
        )}

      </div>

      {/* Milestone Payment Modal */}
      {payingInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 space-y-4 shadow-2xl border border-slate-100">
            <h3 className="font-bold text-base text-slate-900">Release Milestone Payment</h3>
            <p className="text-xs text-slate-500">Vendor: {payingInvoice.vendorName} ({payingInvoice.serviceCategory})</p>
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Amount (₦)</label>
              <input
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button onClick={() => setPayingInvoice(null)} className="flex-1 py-2 border border-slate-200 text-xs font-bold rounded-lg">Cancel</button>
              <button onClick={handleConfirmMilestonePayment} className="flex-1 py-2 bg-[#301d6e] text-white text-xs font-bold rounded-lg">Authorize Release</button>
            </div>
          </div>
        </div>
      )}

      {/* Gate Scanner */}
      {isScannerOpen && (
        <GateScannerModal
          isOpen={isScannerOpen}
          onClose={() => setIsScannerOpen(false)}
          guests={workspace.guests}
          onCheckInGuest={checkInGuest}
        />
      )}
    </DashboardLayout>
  );
}
