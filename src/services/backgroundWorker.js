import supabase from '../lib/supabase';
import gmailService from './gmailService';
import googleDriveService from './googleDriveService';
import googleCalendarService from './googleCalendarService';
import { getNextOccurrence } from '../utils/rruleHelper';

class BackgroundWorker {
  constructor() {
    this.isRunning = false;
    this.intervalId = null;
    this.checkInterval = 60000; // 60 seconds
    this.lastCheck = null;
  }

  start() {
    if (this.isRunning) return false;
    
    console.log('Starting background worker...');
    this.isRunning = true;
    
    // Run immediately once
    this.checkForActions();
    
    // Then set up interval
    this.intervalId = setInterval(() => {
      this.checkForActions();
    }, this.checkInterval);
    
    return true;
  }
  
  stop() {
    if (!this.isRunning) return false;
    
    console.log('Stopping background worker...');
    clearInterval(this.intervalId);
    this.intervalId = null;
    this.isRunning = false;
    
    return true;
  }
  
  async checkForActions() {
    try {
      console.log('Checking for scheduled actions...');
      this.lastCheck = new Date();
      
      // Get all active recurring actions that are due
      const { data: actions, error } = await supabase
        .from('recurring_actions_ax7y2k')
        .select('*')
        .eq('is_active', true)
        .lte('next_run', new Date().toISOString());
      
      if (error) throw error;
      
      if (actions && actions.length > 0) {
        console.log(`Found ${actions.length} actions to process`);
        
        // Process each action
        for (const action of actions) {
          await this.processAction(action);
        }
      }
    } catch (error) {
      console.error('Error checking for actions:', error);
    }
  }
  
  async processAction(action) {
    try {
      console.log(`Processing action: ${action.title}`);
      
      // Create action history entry
      const { data: historyEntry, error: historyError } = await supabase
        .from('action_history_ax7y2k')
        .insert([{
          user_id: action.user_id,
          action_id: action.id,
          type: action.title,
          description: action.description,
          status: 'in_progress'
        }])
        .select()
        .single();
      
      if (historyError) throw historyError;
      
      // Perform the action based on type
      let result = null;
      
      switch (action.action_type) {
        case 'email_check':
          result = await this.performEmailCheck();
          break;
        case 'calendar_sync':
          result = await this.performCalendarSync();
          break;
        case 'report_generation':
          result = await this.performReportGeneration();
          break;
        case 'data_backup':
          result = await this.performDataBackup();
          break;
        default:
          result = 'Unknown action type';
      }
      
      // Calculate next occurrence based on rrule
      const nextRun = getNextOccurrence(action.rrule);
      
      // Update the action with new next_run time
      await supabase
        .from('recurring_actions_ax7y2k')
        .update({
          next_run: nextRun.toISOString(),
          last_run: new Date().toISOString()
        })
        .eq('id', action.id);
      
      // Mark history entry as completed
      await supabase
        .from('action_history_ax7y2k')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          result: result
        })
        .eq('id', historyEntry.id);
      
      console.log(`Action completed: ${action.title}`);
      return true;
    } catch (error) {
      console.error(`Error processing action ${action.title}:`, error);
      
      // Mark history entry as failed
      await supabase
        .from('action_history_ax7y2k')
        .update({
          status: 'failed',
          completed_at: new Date().toISOString(),
          result: `Error: ${error.message}`
        })
        .eq('action_id', action.id)
        .is('completed_at', null);
      
      return false;
    }
  }
  
  // Mock action implementations
  async performEmailCheck() {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return '5 unread emails processed';
  }
  
  async performCalendarSync() {
    await new Promise(resolve => setTimeout(resolve, 1500));
    return 'Calendar synchronized with 3 new events';
  }
  
  async performReportGeneration() {
    await new Promise(resolve => setTimeout(resolve, 3000));
    return 'Weekly report generated successfully';
  }
  
  async performDataBackup() {
    await new Promise(resolve => setTimeout(resolve, 2500));
    return 'Data backup completed - 250MB';
  }
}

const backgroundWorker = new BackgroundWorker();
export default backgroundWorker;