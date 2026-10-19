'use client';

import React, { useState } from 'react';
import { 
  Layers, Users, CheckSquare, Receipt, MessageSquare, Plus, CheckCircle2, 
  Clock, DollarSign, ShieldCheck, QrCode, AlertCircle, Send, FileText, ChevronRight, Check
} from 'lucide-react';
import { ActiveWorkspace, WorkspaceGuest, WorkspaceTask, WorkspaceInvoice, WorkspaceQuote, WorkspaceChatMessage } from '../types';
import { formatNaira } from '../lib/utils';

interface WorkspaceSectionProps {
  workspace: ActiveWorkspace;
  onOpenGateScanner: () => void;
  onUpdateGuestCheckIn: (guestId: string, checkedIn: boolean) => void;
  onAddTask: (task: { title: string; category: WorkspaceTask['category']; assignee: string; dueDate: string; priority: WorkspaceTask['priority'] }) => void;
  onToggleTaskStatus: (taskId: string) => void;
  onApproveQuote: (quoteId: string) => void;
  onSendMessage: (message: string) => void;
  onMakePayment: (invoiceId: string, amount: number) => void;
}

export default function WorkspaceSection({
  workspace,
  onOpenGateScanner,
  onUpdateGuestCheckIn,
  onAddTask,
  onToggleTaskStatus,
  onApproveQuote,
  onSendMessage,
  onMakePayment
}: WorkspaceSectionProps) {
  const [activeTab, setActiveTab] = useState<'guests' | 'tasks' | 'invoices' | 'quotes' | 'chat'>('guests');
  const [guestSearch, setGuestSearch] = useState('');
  const [guestFilter, setGuestFilter] = useState<'all' | 'checked_in' | 'awaiting'>('all');

  // Task form state
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState<WorkspaceTask['category']>('Logistics');
  const [newTaskAssignee, setNewTaskAssignee] = useState('Stephen (Groom)');
  const [newTaskDueDate, setNewTaskDueDate] = useState('Dec 08, 2027');
  const [isAddingTask, setIsAddingTask] = useState(false);

  // Chat input state
  const [chatInput, setChatInput] = useState('');

  // Payment modal state
  const [payingInvoice, setPayingInvoice] = useState<WorkspaceInvoice | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);

  // Filter guests
  const filteredGuests = workspace.guests.filter((g) => {
    const q = guestSearch.toLowerCase();
    const matchesSearch = !q || g.name.toLowerCase().includes(q) || g.ticketCode.toLowerCase().includes(q) || g.email.toLowerCase().includes(q);
    const matchesStatus =
      guestFilter === 'all' ||
      (guestFilter === 'checked_in' && g.checkedIn) ||
      (guestFilter === 'awaiting' && !g.checkedIn);
    return matchesSearch && matchesStatus;
  });

  const checkedInCount = workspace.guests.filter((g) => g.checkedIn).length;
  const totalGuestsInList = workspace.guests.length;
  const completedTasksCount = workspace.tasks.filter((t) => t.status === 'completed').length;
  const taskProgressPercent = Math.round((completedTasksCount / (workspace.tasks.length || 1)) * 100);

  const handleTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    onAddTask({
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
    onSendMessage(chatInput);
    setChatInput('');
  };

  const handleConfirmPayment = () => {
    if (payingInvoice && paymentAmount > 0) {
      onMakePayment(payingInvoice.id, paymentAmount);
      setPayingInvoice(null);
    }
  };

  return (
    <section id="workspace" className="py-16 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#301d6e]/5 text-[#301d6e] text-xs font-bold uppercase tracking-wider mb-2">
              <span className="w-2 h-2 rounded-full bg-[#8ec82d]"></span>
              <span>PILLAR A • PLAN</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-500 font-normal">Event Management Workspace</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-black text-[#301d6e] tracking-tight">
              Live Event Command Center
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-2xl">
              Every event created on Eventory gets its own unified workspace. Track attendees, assign vendor tasks, manage invoices, and coordinate your team from one cockpit.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenGateScanner}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-[#301d6e] hover:bg-[#20134e] text-white shadow-md shadow-[#301d6e]/20 transition-all border-b-2 border-[#8ec82d]"
            >
              <QrCode className="w-4 h-4 text-[#8ec82d]" />
              <span>Launch Gate Scanner</span>
            </button>
          </div>
        </div>

        {/* Workspace Active Card (Direct from Concept Note Section 9) */}
        <div className="bg-gradient-to-r from-[#221451] via-[#301d6e] to-[#26165c] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-white/10 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-[#8ec82d]/10 blur-2xl pointer-events-none"></div>

          {/* Event Title Banner */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-6 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[11px] font-mono uppercase tracking-wider bg-[#8ec82d] text-[#221451] font-black px-2 py-0.5 rounded">
                  ACTIVE WORKSPACE
                </span>
                <span className="text-xs text-purple-200">ID: {workspace.id}</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {workspace.title}
              </h3>
              <p className="text-xs sm:text-sm text-purple-200 mt-1 flex flex-wrap items-center gap-3">
                <span>📅 {workspace.eventDate}</span>
                <span>•</span>
                <span>📍 {workspace.venueName}</span>
                <span>•</span>
                <span className="text-[#8ec82d] font-bold">🎯 Target: {workspace.targetGuests} Guests</span>
              </p>
            </div>

            {/* Live Synchronized Indicator */}
            <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10 text-right">
              <span className="text-[10px] text-purple-200 uppercase font-bold tracking-wider block">Real-time Check-in</span>
              <div className="text-xl font-black text-[#8ec82d] flex items-center gap-1.5 justify-end">
                <span className="w-2.5 h-2.5 rounded-full bg-[#8ec82d] animate-pulse"></span>
                <span>{checkedInCount} / {totalGuestsInList} Checked In</span>
              </div>
            </div>
          </div>

          {/* 6 Core KPI Indicators (Concept Note Section 9) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="bg-white/5 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10">
              <span className="text-[11px] text-purple-200 block font-medium">Guests</span>
              <span className="text-xl sm:text-2xl font-black text-white">{workspace.registeredGuests}</span>
              <span className="text-[10px] text-[#8ec82d] block mt-0.5">registered</span>
            </div>

            <div className="bg-white/5 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10">
              <span className="text-[11px] text-purple-200 block font-medium">Tickets / RSVP</span>
              <span className="text-xl sm:text-2xl font-black text-white">{workspace.registeredGuests}</span>
              <span className="text-[10px] text-purple-300 block mt-0.5">digital passes</span>
            </div>

            <div className="bg-white/5 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10">
              <span className="text-[11px] text-purple-200 block font-medium">Vendors</span>
              <span className="text-xl sm:text-2xl font-black text-white">{workspace.bookedVendors}</span>
              <span className="text-[10px] text-emerald-400 block mt-0.5">contracted</span>
            </div>

            <div className="bg-white/5 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10">
              <span className="text-[11px] text-purple-200 block font-medium">Tasks</span>
              <span className="text-xl sm:text-2xl font-black text-white">{workspace.tasks.length}</span>
              <span className="text-[10px] text-[#8ec82d] block mt-0.5">{completedTasksCount} done</span>
            </div>

            <div className="bg-white/5 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10">
              <span className="text-[11px] text-purple-200 block font-medium">Payments</span>
              <span className="text-xl sm:text-2xl font-black text-white">{formatNaira(workspace.totalPaid)}</span>
              <span className="text-[10px] text-emerald-300 block mt-0.5">settled escrow</span>
            </div>

            <div className="bg-white/5 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10">
              <span className="text-[11px] text-purple-200 block font-medium">Outstanding</span>
              <span className="text-xl sm:text-2xl font-black text-amber-300">{formatNaira(workspace.totalOutstanding)}</span>
              <span className="text-[10px] text-amber-200 block mt-0.5">milestone balance</span>
            </div>
          </div>

        </div>

        {/* Workspace Modules Navigation */}
        <div className="flex items-center gap-1.5 border-b border-slate-200 mb-6 overflow-x-auto scrollbar-none pb-1">
          <button
            onClick={() => setActiveTab('guests')}
            className={`flex items-center gap-2 px-4 py-3 rounded-t-xl text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'guests'
                ? 'border-[#301d6e] text-[#301d6e] bg-purple-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Guests & RSVP</span>
            <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full">
              {workspace.guests.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('tasks')}
            className={`flex items-center gap-2 px-4 py-3 rounded-t-xl text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'tasks'
                ? 'border-[#301d6e] text-[#301d6e] bg-purple-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span>Tasks & Checklist</span>
            <span className="text-[10px] bg-[#8ec82d]/30 text-[#20134e] px-2 py-0.5 rounded-full font-bold">
              {completedTasksCount}/{workspace.tasks.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('invoices')}
            className={`flex items-center gap-2 px-4 py-3 rounded-t-xl text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'invoices'
                ? 'border-[#301d6e] text-[#301d6e] bg-purple-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>Invoices & Payments</span>
            <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full">
              {workspace.invoices.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('quotes')}
            className={`flex items-center gap-2 px-4 py-3 rounded-t-xl text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'quotes'
                ? 'border-[#301d6e] text-[#301d6e] bg-purple-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Vendor Quotes</span>
            <span className="text-[10px] bg-[#8ec82d]/30 text-[#20134e] px-2 py-0.5 rounded-full font-bold">
              {workspace.quotes.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-2 px-4 py-3 rounded-t-xl text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'chat'
                ? 'border-[#301d6e] text-[#301d6e] bg-purple-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Team Coordination Chat</span>
            <span className="text-[10px] bg-purple-100 text-[#301d6e] px-2 py-0.5 rounded-full font-bold">
              Live
            </span>
          </button>
        </div>

        {/* Tab 1: Guests & RSVP Management */}
        {activeTab === 'guests' && (
          <div className="space-y-4">
            
            {/* Filter & Action Toolbar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <input
                  type="text"
                  value={guestSearch}
                  onChange={(e) => setGuestSearch(e.target.value)}
                  placeholder="Search guest by name or ticket code..."
                  className="px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs w-full sm:w-72 focus:outline-none focus:ring-1 focus:ring-[#301d6e]"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end text-xs">
                <button
                  onClick={() => setGuestFilter('all')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                    guestFilter === 'all' ? 'bg-[#301d6e] text-white' : 'bg-white text-slate-600 border border-slate-200'
                  }`}
                >
                  All ({workspace.guests.length})
                </button>
                <button
                  onClick={() => setGuestFilter('checked_in')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                    guestFilter === 'checked_in' ? 'bg-[#8ec82d] text-[#221451]' : 'bg-white text-slate-600 border border-slate-200'
                  }`}
                >
                  Checked In ({checkedInCount})
                </button>
                <button
                  onClick={() => setGuestFilter('awaiting')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                    guestFilter === 'awaiting' ? 'bg-amber-100 text-amber-900' : 'bg-white text-slate-600 border border-slate-200'
                  }`}
                >
                  Awaiting ({totalGuestsInList - checkedInCount})
                </button>
              </div>
            </div>

            {/* Guests Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
                    <tr>
                      <th className="py-3 px-4">Guest Name</th>
                      <th className="py-3 px-4">Contact</th>
                      <th className="py-3 px-4">Tier / Table</th>
                      <th className="py-3 px-4">Ticket Code</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Gate Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredGuests.map((guest) => (
                      <tr key={guest.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-slate-900 block">{guest.name}</span>
                          <span className="text-[10px] text-slate-400 capitalize">{guest.paymentStatus}</span>
                        </td>

                        <td className="py-3.5 px-4 text-slate-600">
                          <div>{guest.phone}</div>
                          <div className="text-[11px] text-slate-400">{guest.email}</div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className={`inline-block font-bold text-[10px] px-2 py-0.5 rounded ${
                            guest.ticketType === 'VIP' ? 'bg-[#301d6e]/10 text-[#301d6e]' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {guest.ticketType}
                          </span>
                          <div className="text-[11px] text-slate-500 mt-0.5">{guest.tableNumber}</div>
                        </td>

                        <td className="py-3.5 px-4 font-mono font-bold text-slate-700">
                          {guest.ticketCode}
                        </td>

                        <td className="py-3.5 px-4">
                          {guest.checkedIn ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              Checked In ({guest.checkInTime || 'Gate 1'})
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                              <Clock className="w-3 h-3 text-amber-600" />
                              Awaiting Arrival
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => onUpdateGuestCheckIn(guest.id, !guest.checkedIn)}
                            className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${
                              guest.checkedIn
                                ? 'bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-600'
                                : 'bg-[#8ec82d] hover:bg-[#75a723] text-[#20134e]'
                            }`}
                          >
                            {guest.checkedIn ? 'Revoke Check-In' : 'Admit Guest'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* Tab 2: Tasks & Checklists */}
        {activeTab === 'tasks' && (
          <div className="space-y-6">
            
            {/* Task Progress Bar */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="w-full sm:w-2/3">
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                  <span>Milestone Completion Progress</span>
                  <span className="text-[#301d6e]">{taskProgressPercent}% ({completedTasksCount} of {workspace.tasks.length} Completed)</span>
                </div>
                <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#301d6e] to-[#8ec82d] rounded-full transition-all duration-500"
                    style={{ width: `${taskProgressPercent}%` }}
                  ></div>
                </div>
              </div>

              <button
                onClick={() => setIsAddingTask(!isAddingTask)}
                className="whitespace-nowrap px-4 py-2 bg-[#301d6e] hover:bg-[#20134e] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4 text-[#8ec82d]" />
                <span>{isAddingTask ? 'Close Form' : 'Add New Task'}</span>
              </button>
            </div>

            {/* Inline Add Task Form */}
            {isAddingTask && (
              <form onSubmit={handleTaskSubmit} className="bg-purple-50/50 p-4 rounded-2xl border border-purple-200 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Task Title *</label>
                    <input
                      type="text"
                      required
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      placeholder="e.g. Inspect sound system wiring at venue"
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                    <select
                      value={newTaskCategory}
                      onChange={(e) => setNewTaskCategory(e.target.value as WorkspaceTask['category'])}
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold"
                    >
                      <option value="Venue">Venue</option>
                      <option value="Catering">Catering</option>
                      <option value="Logistics">Logistics</option>
                      <option value="Media">Media</option>
                      <option value="Guest">Guest</option>
                      <option value="Security">Security</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Assignee</label>
                    <input
                      type="text"
                      value={newTaskAssignee}
                      onChange={(e) => setNewTaskAssignee(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingTask(false)}
                    className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-[#301d6e] text-white text-xs font-bold rounded-lg"
                  >
                    Save Task
                  </button>
                </div>
              </form>
            )}

            {/* Tasks List */}
            <div className="space-y-2.5">
              {workspace.tasks.map((task) => {
                const isCompleted = task.status === 'completed';
                return (
                  <div
                    key={task.id}
                    onClick={() => onToggleTaskStatus(task.id)}
                    className={`cursor-pointer p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                      isCompleted
                        ? 'bg-slate-50 border-slate-200 text-slate-400'
                        : 'bg-white border-slate-200 hover:border-[#301d6e] shadow-xs'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors ${
                        isCompleted
                          ? 'bg-[#8ec82d] border-[#8ec82d] text-[#221451]'
                          : 'border-slate-300 bg-white'
                      }`}>
                        {isCompleted && <Check className="w-4 h-4 stroke-[3]" />}
                      </div>

                      <div>
                        <span className={`text-xs sm:text-sm font-bold block ${
                          isCompleted ? 'line-through text-slate-400' : 'text-slate-900'
                        }`}>
                          {task.title}
                        </span>
                        <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500">
                          <span className="font-semibold text-[#301d6e]">{task.category}</span>
                          <span>•</span>
                          <span>Assignee: {task.assignee}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-[11px] font-mono text-slate-500 hidden sm:inline">
                        Due: {task.dueDate}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        task.priority === 'high' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* Tab 3: Invoices & Payments */}
        {activeTab === 'invoices' && (
          <div className="space-y-6">
            
            {/* Financial Overview Banner */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <span className="text-xs text-slate-500 uppercase font-bold">Total Contracted Budget</span>
                <span className="text-xl font-black text-slate-900 block mt-1">
                  {formatNaira(workspace.totalBudget)}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-500 uppercase font-bold">Total Paid to Escrow</span>
                <span className="text-xl font-black text-emerald-600 block mt-1">
                  {formatNaira(workspace.totalPaid)}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-500 uppercase font-bold">Outstanding Milestone Balance</span>
                <span className="text-xl font-black text-amber-600 block mt-1">
                  {formatNaira(workspace.totalOutstanding)}
                </span>
              </div>
            </div>

            {/* Invoices List */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
                    <tr>
                      <th className="py-3 px-4">Invoice #</th>
                      <th className="py-3 px-4">Vendor & Service</th>
                      <th className="py-3 px-4">Total Amount</th>
                      <th className="py-3 px-4">Paid to Date</th>
                      <th className="py-3 px-4">Balance</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {workspace.invoices.map((inv) => {
                      const balance = inv.amount - inv.paidAmount;
                      return (
                        <tr key={inv.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-bold text-slate-700">
                            {inv.invoiceNumber}
                            <div className="text-[10px] text-slate-400 font-normal">Due: {inv.dueDate}</div>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="font-bold text-slate-900 block">{inv.vendorName}</span>
                            <span className="text-[11px] text-slate-500">{inv.serviceCategory}</span>
                          </td>

                          <td className="py-3.5 px-4 font-bold text-slate-900">
                            {formatNaira(inv.amount)}
                          </td>

                          <td className="py-3.5 px-4 font-semibold text-emerald-600">
                            {formatNaira(inv.paidAmount)}
                          </td>

                          <td className="py-3.5 px-4 font-bold text-amber-600">
                            {formatNaira(balance)}
                          </td>

                          <td className="py-3.5 px-4">
                            <span className={`inline-block font-bold text-[10px] px-2 py-0.5 rounded-full ${
                              inv.status === 'paid'
                                ? 'bg-emerald-100 text-emerald-800'
                                : inv.status === 'partially_paid'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}>
                              {inv.status === 'paid' ? 'Settled' : inv.status === 'partially_paid' ? 'Partially Paid' : 'Pending Approval'}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            {balance > 0 ? (
                              <button
                                onClick={() => {
                                  setPayingInvoice(inv);
                                  setPaymentAmount(balance);
                                }}
                                className="px-3 py-1.5 rounded-lg font-bold text-xs bg-[#301d6e] hover:bg-[#20134e] text-white shadow-xs"
                              >
                                Pay Milestone
                              </button>
                            ) : (
                              <span className="text-emerald-600 font-bold text-xs flex items-center gap-1 justify-end">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                Completed
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pay Milestone Modal */}
            {payingInvoice && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
                <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-100 space-y-4">
                  <div className="flex justify-between items-center border-b pb-3">
                    <h4 className="font-bold text-slate-900">Make Milestone Payment</h4>
                    <button onClick={() => setPayingInvoice(null)} className="text-slate-400 hover:text-slate-600">✕</button>
                  </div>

                  <div className="space-y-1 text-xs">
                    <span className="text-slate-500">Vendor:</span>
                    <strong className="block text-slate-900">{payingInvoice.vendorName}</strong>
                    <span className="text-slate-500 mt-2 block">Outstanding Balance:</span>
                    <strong className="text-amber-600 text-base">{formatNaira(payingInvoice.amount - payingInvoice.paidAmount)}</strong>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Payment Amount (₦)</label>
                    <input
                      type="number"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(Number(e.target.value))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={() => setPayingInvoice(null)}
                      className="px-3 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirmPayment}
                      className="px-4 py-2 bg-[#8ec82d] text-[#221451] font-black text-xs rounded-xl shadow-xs"
                    >
                      Authorize Payment
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* Tab 4: Vendor Quotes */}
        {activeTab === 'quotes' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-600">
              <span>Quotes requested from Eventory Marketplace service providers.</span>
              <span className="font-bold text-[#301d6e]">Instant Binding Contracts</span>
            </div>

            <div className="space-y-3">
              {workspace.quotes.map((quote) => {
                const isApproved = quote.status === 'approved';
                return (
                  <div
                    key={quote.id}
                    className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm text-slate-900">{quote.vendorName}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-[#301d6e]">
                          {quote.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 max-w-xl">{quote.details}</p>
                      <span className="text-[11px] text-slate-400 block">Submitted on {quote.submittedDate}</span>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 shrink-0">
                      <span className="text-base font-black text-[#301d6e]">
                        {formatNaira(quote.quotedAmount)}
                      </span>

                      {isApproved ? (
                        <span className="px-3 py-1 rounded-lg text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Approved & Contracted
                        </span>
                      ) : (
                        <button
                          onClick={() => onApproveQuote(quote.id)}
                          className="px-4 py-2 rounded-xl text-xs font-bold bg-[#8ec82d] hover:bg-[#75a723] text-[#20134e] shadow-xs"
                        >
                          Approve Quote
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 5: Team Coordination Chat */}
        {activeTab === 'chat' && (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col h-[480px]">
            
            {/* Chat Header */}
            <div className="bg-slate-50 p-3.5 border-b border-slate-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#8ec82d] animate-pulse"></span>
                <span className="font-bold text-slate-800">Event Operations Coordination Room</span>
                <span className="text-slate-400">({workspace.title})</span>
              </div>
              <span className="text-[11px] text-slate-500 font-mono">End-to-End Encrypted</span>
            </div>

            {/* Chat Messages Log */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5">
              {workspace.chatMessages.map((msg) => (
                <div key={msg.id} className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full ${msg.avatarColor} text-white font-bold text-xs flex items-center justify-center shrink-0`}>
                    {msg.sender.charAt(0)}
                  </div>
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 max-w-xl">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-xs text-slate-900">{msg.sender}</span>
                      <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded font-medium">{msg.role}</span>
                      <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">{msg.message}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Send Input */}
            <form onSubmit={handleChatSubmit} className="p-3 bg-slate-50 border-t border-slate-200 flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Coordinate with planners, bride, groom, caterers..."
                className="flex-1 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#301d6e]"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-[#301d6e] hover:bg-[#20134e] text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5 text-[#8ec82d]" />
                <span>Send</span>
              </button>
            </form>

          </div>
        )}

      </div>
    </section>
  );
}
