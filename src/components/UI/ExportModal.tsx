import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useUserProfile } from '../../contexts/UserProfileContext';
import Modal from './Modal';
import Button from './Button';
import Icon from './Icon';
import { supabase } from '../../lib/supabase';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ThoughtForExport {
  id: string;
  content: string;
  date: string;
  number: number;
  created_at: string;
}

export default function ExportModal({ isOpen, onClose }: ExportModalProps) {
  const { user } = useAuth();
  const { profile } = useUserProfile();
  const [days, setDays] = useState(7);
  const [isExporting, setIsExporting] = useState(false);
  const [exportedContent, setExportedContent] = useState('');
  const [isContentGenerated, setIsContentGenerated] = useState(false);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copying' | 'success' | 'error'>('idle');

  const getDaysSinceBirthForDate = (dateString: string): number | null => {
    if (!profile?.birth_date) return null;
    
    const birthDate = new Date(profile.birth_date);
    const targetDate = new Date(dateString);
    
    // Reset time to avoid timezone issues
    birthDate.setHours(0, 0, 0, 0);
    targetDate.setHours(0, 0, 0, 0);
    
    const diffTime = targetDate.getTime() - birthDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays >= 0 ? diffDays + 1 : null; // +1 because birth day is day 1
  };

  const formatThoughtsToMarkdown = (thoughtsByDate: Record<string, ThoughtForExport[]>) => {
    let markdown = '';
    
    // Sort dates in ascending order (oldest first)
    const sortedDates = Object.keys(thoughtsByDate).sort((a, b) => a.localeCompare(b));
    
    for (const date of sortedDates) {
      const thoughts = thoughtsByDate[date];
      if (thoughts.length === 0) continue;
      
      // Get days since birth for this date
      const daysSinceBirth = getDaysSinceBirthForDate(date);
      const dateTitle = daysSinceBirth ? daysSinceBirth.toString() : date;
      
      markdown += `## ${dateTitle}\n\n`;
      
      // Sort thoughts by number (ascending - they are already sorted by created_at when numbers were assigned)
      const sortedThoughts = thoughts.sort((a, b) => a.number - b.number);
      
      for (const thought of sortedThoughts) {
        markdown += `### ${thought.number}\n\n${thought.content}\n\n`;
      }
    }
    
    return markdown.trim();
  };

  const handleExport = async () => {
    if (!user) return;
    
    setIsExporting(true);
    try {
      // Calculate start date
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - days + 1);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
      
      // Fetch thoughts from database
      const { data: thoughts, error } = await supabase
        .from('thoughts')
        .select('id, content, date, created_at')
        .eq('user_id', user.id)
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      
      if (!thoughts || thoughts.length === 0) {
        setExportedContent('# No thoughts found in the selected date range.\n\nTry selecting a different time period.');
        setIsContentGenerated(true);
        return;
      }
      
      // Group thoughts by date and assign numbers
      const thoughtsByDate: Record<string, ThoughtForExport[]> = {};
      
      for (const thought of thoughts) {
        if (!thoughtsByDate[thought.date]) {
          thoughtsByDate[thought.date] = [];
        }
        thoughtsByDate[thought.date].push(thought as ThoughtForExport);
      }
      
      // Assign numbers within each date
      for (const date of Object.keys(thoughtsByDate)) {
        thoughtsByDate[date] = thoughtsByDate[date]
          .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
          .map((thought, index) => ({ ...thought, number: index + 1 }));
      }
      
      const markdown = formatThoughtsToMarkdown(thoughtsByDate);
      setExportedContent(markdown);
      setIsContentGenerated(true);
      
    } catch (error) {
      console.error('Export failed:', error);
      setExportedContent('# Export failed\n\nAn error occurred while exporting your thoughts. Please try again.');
      setIsContentGenerated(true);
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([exportedContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `thoughts-${days}-days-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = async () => {
    setCopyStatus('copying');
    
    try {
      // Try modern clipboard API first
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(exportedContent);
        setCopyStatus('success');
      } else {
        // Fallback for older browsers or non-HTTPS
        const textArea = document.createElement('textarea');
        textArea.value = exportedContent;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        
        if (successful) {
          setCopyStatus('success');
        } else {
          throw new Error('Copy command failed');
        }
      }
      
      // Reset status after 2 seconds
      setTimeout(() => setCopyStatus('idle'), 2000);
      
    } catch (error) {
      console.error('Copy failed:', error);
      setCopyStatus('error');
      
      // Reset status after 3 seconds
      setTimeout(() => setCopyStatus('idle'), 3000);
    }
  };

  const handleClose = () => {
    setIsContentGenerated(false);
    setExportedContent('');
    setDays(7);
    setCopyStatus('idle');
    onClose();
  };

  const previewContent = exportedContent.length > 500 
    ? exportedContent.substring(0, 500) + '...' 
    : exportedContent;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Export Thoughts"
      footer={
        !isContentGenerated ? (
          <>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleExport} 
              isLoading={isExporting}
              disabled={isExporting}
            >
              Export
            </Button>
          </>
        ) : (
          <>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <div className="flex space-x-2">
              <Button 
                variant="secondary"
                onClick={handleCopy}
                disabled={copyStatus === 'copying'}
                className={`flex items-center space-x-2 ${
                  copyStatus === 'success' ? 'bg-green-50 border-green-200 text-green-700' :
                  copyStatus === 'error' ? 'bg-danger border-danger text-danger' : ''
                }`}
              >
                <Icon name="copy" className="w-4 h-4" />
                <span>
                  {copyStatus === 'copying' && 'Copying...'}
                  {copyStatus === 'success' && 'Copied!'}
                  {copyStatus === 'error' && 'Failed'}
                  {copyStatus === 'idle' && 'Copy'}
                </span>
              </Button>
              <Button 
                onClick={handleDownload}
                className="flex items-center space-x-2"
              >
                <Icon name="download" className="w-4 h-4" />
                <span>Download</span>
              </Button>
            </div>
          </>
        )
      }
    >
      {!isContentGenerated ? (
        <div className="space-y-4">
          <div>
            <label className="block diary-text text-sm font-medium mb-2">
              Export thoughts from the last:
            </label>
            <select
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="input w-full"
            >
              <option value={3}>3 days</option>
              <option value={7}>7 days</option>
              <option value={14}>14 days</option>
              <option value={30}>30 days</option>
              <option value={90}>90 days</option>
            </select>
          </div>
          
          <p className="diary-text text-sm opacity-75">
            This will compile all your thoughts from the selected time period into a single Markdown file.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <h3 className="diary-text font-medium mb-2">Export Preview</h3>
            <div className="bg-interactive border border-medium rounded-lg p-4 max-h-64 overflow-y-auto">
              <pre className="diary-text text-sm whitespace-pre-wrap font-mono">
                {previewContent}
              </pre>
              {exportedContent.length > 500 && (
                <div className="mt-2 text-center">
                  <span className="diary-text text-xs text-muted">
                    ... and {Math.ceil((exportedContent.length - 500) / 100)} more lines
                  </span>
                </div>
              )}
            </div>
          </div>
          
          <p className="diary-text text-sm opacity-75">
            Content is ready for download or copying to clipboard.
          </p>
        </div>
      )}
    </Modal>
  );
}