import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import apiService from '../utils/apiService';
import { API_BASE_URL } from '../utils/api';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement,
  RadialLinearScale,
  Filler
} from 'chart.js';
import { Pie, Bar, Doughnut, PolarArea } from 'react-chartjs-2';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement,
  RadialLinearScale,
  Filler
);

// Modal Component for Fullscreen Charts
const ChartModal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 rounded-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6 flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

// Dropdown Menu Component
const DropdownMenu = ({ items }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    // Only add the event listener when the dropdown is open
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close dropdown when ESC key is pressed
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Chart options"
        className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-md p-1"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20 py-1 border border-gray-100 overflow-hidden">
          {items.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                item.onClick();
                setIsOpen(false);
              }}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            >
              <div className="flex items-center">
                {item.icon && <span className="mr-2">{item.icon}</span>}
                {item.label}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeChart, setActiveChart] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', chart: null });
  const chartRefs = {
    'graduation-years': useRef(null),
    'degree-distribution': useRef(null),
    'employment-status': useRef(null),
    'geographic-distribution': useRef(null),
    'alumni-engagement': useRef(null),
    'career-support-feedback': useRef(null),
    'popular-programs': useRef(null),
    'recent-activity': useRef(null)
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        console.log('Fetching dashboard data...');
        console.log('Using API URL:', API_BASE_URL);

        // Use apiService instead of direct axios call
        const data = await apiService.getDashboardData();

        console.log('Dashboard data received:', data);
        setDashboardData(data);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-3 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  // Helper functions for dropdown menu actions
  const handleDownloadChart = (chartId) => {
    console.log(`Downloading chart: ${chartId}`);

    // Get the chart title based on the chartId
    const chartTitles = {
      'graduation-years': 'Alumni by Graduation Year',
      'degree-distribution': 'Degree Program Distribution',
      'employment-status': 'Employment Status',
      'geographic-distribution': 'Geographic Distribution',
      'alumni-engagement': 'Alumni Engagement',
      'career-support-feedback': 'Career Support Feedback',
      'popular-programs': 'Most Popular Programs',
      'recent-activity': 'Recent Activity'
    };

    // Create a mock CSV content based on the chart type
    let csvContent = '';

    if (chartId === 'graduation-years') {
      csvContent = 'Year,Count\n';
      Object.entries(data.graduationYears || {}).forEach(([year, count]) => {
        csvContent += `${year},${count}\n`;
      });
    } else if (chartId === 'degree-distribution') {
      csvContent = 'Degree,Count\n';
      Object.entries(data.degreeDistribution || {}).forEach(([degree, count]) => {
        csvContent += `${degree},${count}\n`;
      });
    } else if (chartId === 'employment-status') {
      csvContent = 'Status,Count\n';
      Object.entries(data.employmentStatus || {}).forEach(([status, count]) => {
        csvContent += `${status},${count}\n`;
      });
    } else {
      csvContent = 'Category,Value\n';
      csvContent += 'Sample Data,100\n';
    }

    // Create a Blob with the CSV content
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    // Create a temporary link element and trigger the download
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${chartTitles[chartId] || 'chart'}.csv`);
    document.body.appendChild(link);
    link.click();

    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleRefreshChart = (chartId) => {
    console.log(`Refreshing chart: ${chartId}`);

    // Show the refresh animation
    setActiveChart(chartId);

    // Simulate a data refresh with a timeout
    setTimeout(() => {
      // If this were a real app, we would re-fetch the data here
      // For now, we'll just update the state to trigger a re-render
      setDashboardData({
        ...dashboardData,
        lastUpdated: new Date().toISOString()
      });

      // Remove the refresh animation
      setActiveChart(null);
    }, 1000);
  };

  const handleFullscreen = (chartId) => {
    console.log(`Fullscreen chart: ${chartId}`);

    // Get the chart title based on the chartId
    const chartTitles = {
      'graduation-years': 'Alumni by Graduation Year',
      'degree-distribution': 'Degree Program Distribution',
      'employment-status': 'Employment Status',
      'geographic-distribution': 'Geographic Distribution',
      'alumni-engagement': 'Alumni Engagement',
      'career-support-feedback': 'Career Support Feedback',
      'popular-programs': 'Most Popular Programs',
      'recent-activity': 'Recent Activity'
    };

    // Set the modal content based on the chart type
    setModalContent({
      title: chartTitles[chartId] || 'Chart',
      chart: chartId
    });

    // Open the modal
    setModalOpen(true);
  };

  const handleShareChart = (chartId) => {
    console.log(`Sharing chart: ${chartId}`);

    // Get the chart title based on the chartId
    const chartTitles = {
      'graduation-years': 'Alumni by Graduation Year',
      'degree-distribution': 'Degree Program Distribution',
      'employment-status': 'Employment Status',
      'geographic-distribution': 'Geographic Distribution',
      'alumni-engagement': 'Alumni Engagement',
      'career-support-feedback': 'Career Support Feedback',
      'popular-programs': 'Most Popular Programs',
      'recent-activity': 'Recent Activity'
    };

    // Create a shareable link (in a real app, this would be a unique URL)
    const shareableLink = `https://alumni-management-system.example.com/share/${chartId}`;

    // Create a temporary input element to copy the link
    const input = document.createElement('input');
    input.value = shareableLink;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);

    // Show a notification (using alert for simplicity)
    alert(`Link for "${chartTitles[chartId]}" copied to clipboard: ${shareableLink}`);
  };

  // Generate dropdown menu items for each chart
  const getChartMenuItems = (chartId) => [
    {
      label: 'Refresh Data',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
        </svg>
      ),
      onClick: () => handleRefreshChart(chartId)
    },
    {
      label: 'Download',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      ),
      onClick: () => handleDownloadChart(chartId)
    },
    {
      label: 'Fullscreen',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
      ),
      onClick: () => handleFullscreen(chartId)
    },
    {
      label: 'Share',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
        </svg>
      ),
      onClick: () => handleShareChart(chartId)
    }
  ];

  // Use data from API or fallback to mock data
  const data = dashboardData || {
    totalAlumni: 1250,
    employmentRate: 78.5,
    graduationRate: 92.3,
    alumniEngagement: 82.3,
    recentActivity: [],
    degreeDistribution: {
      'Computer Science': 35,
      'Business': 25,
      'Engineering': 20,
      'Arts': 10,
      'Others': 10
    },
    employmentStatus: {
      'Employed': 78,
      'Unemployed': 12,
      'Further Studies': 10
    },
    graduationYears: {
      '2018': 220,
      '2019': 245,
      '2020': 260,
      '2021': 275,
      '2022': 250
    },
    geographicDistribution: {
      'Local': 65,
      'International': 35
    },
    engagementData: {
      'Events': 45,
      'Surveys': 30,
      'Platform Logins': 85,
      'Mentorship': 25
    },
    feedbackSummary: {
      '1 Stars': 5,
      '2 Stars': 10,
      '3 Stars': 25,
      '4 Stars': 40,
      '5 Stars': 20
    },
    programParticipation: {
      'Annual Reunion': 120,
      'Career Fair': 95,
      'Mentorship Program': 75,
      'Networking Event': 60,
      'Workshop Series': 45
    }
  };

  // Chart colors
  const chartColors = [
    'rgba(54, 162, 235, 0.6)',   // Blue
    'rgba(255, 99, 132, 0.6)',   // Red
    'rgba(255, 206, 86, 0.6)',   // Yellow
    'rgba(75, 192, 192, 0.6)',   // Green
    'rgba(153, 102, 255, 0.6)',  // Purple
    'rgba(255, 159, 64, 0.6)',   // Orange
    'rgba(199, 199, 199, 0.6)',  // Gray
    'rgba(83, 102, 255, 0.6)',   // Indigo
    'rgba(255, 99, 255, 0.6)',   // Pink
    'rgba(0, 162, 151, 0.6)',    // Teal
  ];

  // 2. Alumni Distribution by Degree Program
  const degreeChartData = {
    labels: Object.keys(data.degreeDistribution || {}),
    datasets: [
      {
        data: Object.values(data.degreeDistribution || {}),
        backgroundColor: chartColors.slice(0, Object.keys(data.degreeDistribution || {}).length),
        borderWidth: 1,
      },
    ],
  };

  // 3. Current Employment Status Breakdown
  const employmentChartData = {
    labels: Object.keys(data.employmentStatus || {}),
    datasets: [
      {
        data: Object.values(data.employmentStatus || {}),
        backgroundColor: chartColors.slice(0, Object.keys(data.employmentStatus || {}).length),
        borderWidth: 1,
      },
    ],
  };

  // 1. Total Number of Registered Alumni (by Year Graduated)
  const graduationYearsData = {
    labels: Object.keys(data.graduationYears || {}),
    datasets: [
      {
        label: 'Alumni Count',
        data: Object.values(data.graduationYears || {}),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  // 4. Geographic Distribution of Alumni (Local vs. International)
  const geographicDistributionData = {
    labels: Object.keys(data.geographicDistribution || {}),
    datasets: [
      {
        data: Object.values(data.geographicDistribution || {}),
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 99, 132, 0.6)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // 6. Alumni Engagement Rate (Events, Surveys, Platform Logins)
  const engagementData = {
    labels: Object.keys(data.engagementData || {}),
    datasets: [
      {
        label: 'Engagement Count',
        data: Object.values(data.engagementData || {}),
        backgroundColor: chartColors.slice(0, Object.keys(data.engagementData || {}).length),
        borderWidth: 1,
      },
    ],
  };

  // 7. Feedback Summary from Career Support Services
  const feedbackSummaryData = {
    labels: Object.keys(data.feedbackSummary || {}),
    datasets: [
      {
        label: 'Feedback Count',
        data: Object.values(data.feedbackSummary || {}),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(54, 162, 235, 0.6)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // 8. Most Participated Alumni Programs or Activities
  const programParticipationData = {
    labels: Object.keys(data.programParticipation || {}),
    datasets: [
      {
        label: 'Participants',
        data: Object.values(data.programParticipation || {}),
        backgroundColor: chartColors.slice(0, Object.keys(data.programParticipation || {}).length),
        borderWidth: 1,
      },
    ],
  };

  // Function to render the appropriate chart in the modal
  const renderModalChart = () => {
    const chartId = modalContent.chart;

    if (chartId === 'graduation-years') {
      return (
        <div className="h-[600px]">
          <Bar
            data={graduationYearsData}
            options={{
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  grid: {
                    color: 'rgba(0, 0, 0, 0.05)'
                  }
                },
                x: {
                  grid: {
                    display: false
                  }
                }
              }
            }}
          />
        </div>
      );
    } else if (chartId === 'degree-distribution') {
      return (
        <div className="h-[600px]">
          <Pie
            data={degreeChartData}
            options={{
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'right',
                  labels: {
                    boxWidth: 12,
                    padding: 15
                  }
                }
              }
            }}
          />
        </div>
      );
    } else if (chartId === 'employment-status') {
      return (
        <div className="h-[600px]">
          <Doughnut
            data={employmentChartData}
            options={{
              maintainAspectRatio: false,
              cutout: '70%',
              plugins: {
                legend: {
                  position: 'bottom',
                  labels: {
                    boxWidth: 12,
                    padding: 15
                  }
                }
              }
            }}
          />
        </div>
      );
    } else if (chartId === 'geographic-distribution') {
      return (
        <div className="h-[600px]">
          <Pie
            data={geographicDistributionData}
            options={{
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'bottom',
                  labels: {
                    boxWidth: 12,
                    padding: 15
                  }
                }
              }
            }}
          />
        </div>
      );
    } else if (chartId === 'alumni-engagement') {
      return (
        <div className="h-[600px]">
          <Bar
            data={engagementData}
            options={{
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  grid: {
                    color: 'rgba(0, 0, 0, 0.05)'
                  }
                },
                x: {
                  grid: {
                    display: false
                  }
                }
              }
            }}
          />
        </div>
      );
    } else if (chartId === 'career-support-feedback') {
      return (
        <div className="h-[600px]">
          <PolarArea
            data={feedbackSummaryData}
            options={{
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'right',
                  labels: {
                    boxWidth: 12,
                    padding: 15
                  }
                }
              },
              scales: {
                r: {
                  ticks: {
                    display: false
                  }
                }
              }
            }}
          />
        </div>
      );
    } else if (chartId === 'popular-programs') {
      return (
        <div className="h-[600px]">
          <Bar
            data={programParticipationData}
            options={{
              maintainAspectRatio: false,
              indexAxis: 'y',
              plugins: {
                legend: {
                  display: false
                }
              },
              scales: {
                x: {
                  beginAtZero: true,
                  grid: {
                    color: 'rgba(0, 0, 0, 0.05)'
                  }
                },
                y: {
                  grid: {
                    display: false
                  }
                }
              }
            }}
          />
        </div>
      );
    } else {
      return <div>No chart selected</div>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Fullscreen Chart Modal */}
      <ChartModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalContent.title}
      >
        {renderModalChart()}
      </ChartModal>

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h2>
          <p className="mt-1 text-sm text-gray-500">
            Overview of alumni statistics and engagement metrics
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-primary-50 text-primary-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            Last updated: {new Date().toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-lg bg-blue-50 text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Alumni</p>
                <p className="text-2xl font-bold text-gray-800">{data.totalAlumni}</p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-50">
              <div className="flex items-center text-xs text-gray-500">
                <span className="inline-flex items-center text-green-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                  </svg>
                  5.2%
                </span>
                <span className="ml-1">since last month</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-lg bg-green-50 text-green-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                  <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Employment Rate</p>
                <p className="text-2xl font-bold text-gray-800">{data.employmentRate.toFixed(1)}%</p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-50">
              <div className="flex items-center text-xs text-gray-500">
                <span className="inline-flex items-center text-green-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                  </svg>
                  2.3%
                </span>
                <span className="ml-1">since last quarter</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-lg bg-yellow-50 text-yellow-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Graduation Rate</p>
                <p className="text-2xl font-bold text-gray-800">{data.graduationRate.toFixed(1)}%</p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-50">
              <div className="flex items-center text-xs text-gray-500">
                <span className="inline-flex items-center text-green-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                  </svg>
                  1.8%
                </span>
                <span className="ml-1">since last year</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-lg bg-purple-50 text-purple-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Alumni Engagement</p>
                <p className="text-2xl font-bold text-gray-800">{data.alumniEngagement ? data.alumniEngagement.toFixed(1) : '82.3'}%</p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-50">
              <div className="flex items-center text-xs text-gray-500">
                <span className="inline-flex items-center text-green-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                  </svg>
                  5.2%
                </span>
                <span className="ml-1">since last month</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 1. Alumni by Graduation Year */}
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Alumni by Graduation Year</h3>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                  {Object.keys(data.graduationYears || {}).length} Years
                </span>
                <DropdownMenu items={getChartMenuItems('graduation-years')} />
              </div>
            </div>
            <div className={`h-72 ${activeChart === 'graduation-years' ? 'animate-pulse' : ''}`}>
              <Bar
                data={graduationYearsData}
                options={{
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                      }
                    },
                    x: {
                      grid: {
                        display: false
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* 2. Alumni Distribution by Degree Program */}
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Degree Program Distribution</h3>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                  {Object.keys(data.degreeDistribution || {}).length} Programs
                </span>
                <DropdownMenu items={getChartMenuItems('degree-distribution')} />
              </div>
            </div>
            <div className={`h-72 ${activeChart === 'degree-distribution' ? 'animate-pulse' : ''}`}>
              <Pie
                data={degreeChartData}
                options={{
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'right',
                      labels: {
                        boxWidth: 12,
                        padding: 15
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* 3. Current Employment Status */}
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Employment Status</h3>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                  Current
                </span>
                <DropdownMenu items={getChartMenuItems('employment-status')} />
              </div>
            </div>
            <div className={`h-72 ${activeChart === 'employment-status' ? 'animate-pulse' : ''}`}>
              <Doughnut
                data={employmentChartData}
                options={{
                  maintainAspectRatio: false,
                  cutout: '70%',
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: {
                        boxWidth: 12,
                        padding: 15
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* 4. Geographic Distribution */}
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Geographic Distribution</h3>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                  {Object.keys(data.geographicDistribution || {}).length} Regions
                </span>
                <button className="text-gray-400 hover:text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="h-72">
              <Pie
                data={geographicDistributionData}
                options={{
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: {
                        boxWidth: 12,
                        padding: 15
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* 5. Alumni Engagement Rate */}
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Alumni Engagement</h3>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                  By Activity
                </span>
                <button className="text-gray-400 hover:text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="h-72">
              <Bar
                data={engagementData}
                options={{
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                      }
                    },
                    x: {
                      grid: {
                        display: false
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* 6. Career Support Feedback */}
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Career Support Feedback</h3>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                  By Rating
                </span>
                <button className="text-gray-400 hover:text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="h-72">
              <PolarArea
                data={feedbackSummaryData}
                options={{
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'right',
                      labels: {
                        boxWidth: 12,
                        padding: 15
                      }
                    }
                  },
                  scales: {
                    r: {
                      ticks: {
                        display: false
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* 7. Most Popular Programs */}
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Most Popular Programs</h3>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                  By Participation
                </span>
                <button className="text-gray-400 hover:text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="h-72">
              <Bar
                data={programParticipationData}
                options={{
                  maintainAspectRatio: false,
                  indexAxis: 'y',
                  plugins: {
                    legend: {
                      display: false
                    }
                  },
                  scales: {
                    x: {
                      beginAtZero: true,
                      grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                      }
                    },
                    y: {
                      grid: {
                        display: false
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* 8. Recent Activity */}
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Recent Activity</h3>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                  Last 7 Days
                </span>
                <button className="text-gray-400 hover:text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="h-72 overflow-y-auto">
              {data.recentActivity && data.recentActivity.length > 0 ? (
                <ul className="space-y-4">
                  {data.recentActivity.map((activity, index) => (
                    <li key={index} className="flex items-start">
                      <div className={`flex-shrink-0 w-2 h-2 mt-2 rounded-full ${
                        activity.type === 'registration' ? 'bg-blue-500' :
                        activity.type === 'job' ? 'bg-green-500' :
                        activity.type === 'event' ? 'bg-yellow-500' :
                        'bg-purple-500'
                      }`}></div>
                      <div className="ml-3 border-b border-gray-100 pb-4 w-full">
                        <div className="text-sm" dangerouslySetInnerHTML={{ __html: activity.message }} />
                        <div className="text-xs text-gray-500 mt-1">{activity.time}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm">No recent activity</p>
                  <p className="text-xs text-gray-400 mt-1">Check back later for updates</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
