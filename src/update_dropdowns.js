// This is a temporary script to help us update all the dropdown menus in the Dashboard.js file

// 1. Alumni by Graduation Year
const dropdown1 = `<DropdownMenu items={getChartMenuItems('graduation-years')} />`;

// 2. Degree Program Distribution
const dropdown2 = `<DropdownMenu items={getChartMenuItems('degree-distribution')} />`;

// 3. Employment Status
const dropdown3 = `<DropdownMenu items={getChartMenuItems('employment-status')} />`;

// 4. Geographic Distribution
const dropdown4 = `<DropdownMenu items={getChartMenuItems('geographic-distribution')} />`;

// 5. Alumni Engagement
const dropdown5 = `<DropdownMenu items={getChartMenuItems('alumni-engagement')} />`;

// 6. Career Support Feedback
const dropdown6 = `<DropdownMenu items={getChartMenuItems('career-support-feedback')} />`;

// 7. Most Popular Programs
const dropdown7 = `<DropdownMenu items={getChartMenuItems('popular-programs')} />`;

// 8. Recent Activity
const dropdown8 = `<DropdownMenu items={getChartMenuItems('recent-activity')} />`;

// The button pattern to replace
const buttonPattern = `<button className="text-gray-400 hover:text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </button>`;
