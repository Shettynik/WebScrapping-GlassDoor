import puppeteer from "puppeteer";

// This script will provide jobs available under a particular company and will get the company link from the company.js file 
//Example output format => [{
//     salaryLink: '/Salary/Tata-Consultancy-Services-Systems-Engineer-Salaries-E13461_D_KO26,42.htm',
//     salary: '₹4L-₹7L',
//     jobType: 'Systems Engineer'
//   },
//   {
//     salaryLink: '/Salary/Tata-Consultancy-Services-IT-Analyst-Salaries-E13461_D_KO26,36.htm',
//     salary: '₹6L-₹11L',
//     jobType: 'IT Analyst'
//   }]

// salaryLink will give additional information regarding the salary

const getJobs = async () => {
  const browser = await puppeteer.launch({
    headless: true
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36');

//   Below link is obtained from the company.js file
  await page.goto("https://www.glassdoor.co.in/Salary/Tata-Consultancy-Services-Salaries-E13461_P1.htm", {
    waitUntil: "domcontentloaded",
  });
  
  const jobs = await page.evaluate(() => {

    const jobList = document.querySelectorAll(".salarylist_table-row__ThC_D");

    return Array.from(jobList).map((job) => {
        const salaryLink = job.querySelector(".salarylist_table-element__BUQE4 a").getAttribute("href");
        const salary = job.querySelector(".salarylist_bold__J20df").innerText;
        const jobType = job.querySelector(".salarylist_table-element__BUQE4 a").textContent;
    
        return { salaryLink, salary, jobType };
    });
  });

  console.log(jobs);
  return jobs;

//   await browser.close();
};

// Start the scraping
getJobs();