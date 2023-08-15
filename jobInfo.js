import puppeteer from "puppeteer";

// This script filters out jobs based on location and job title for a particular company 
// Example output format =>   {
//     companyLogo: 'https://media.glassdoor.com/sql/4138/accenture-squarelogo-1603988625135.png',
//     jobTech: 'Accenture\nHuman Performance Analyst\nIndia',
//     jobTitle: 'Human Performance Analyst'
//   },
//   {
//     text: 'https://media.glassdoor.com/sql/4138/accenture-squarelogo-1603988625135.png',
//     jobTech: 'Accenture\nPython (Programming Language) Technology Educator\nNoida',
//     jobTitle: 'Python (Programming Language) Technology Educator'
//   }

const getJobInfo = async (jobTitle=null, location=null) => {

  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: null,
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36');

  let url = "https://www.glassdoor.co.in/Jobs/Accenture";

  if(jobTitle!=null){
    url += "-"+jobTitle
  }
  if(location!=null){
    url+="-"+location
  }

  url += "-Jobs-E4138.htm?filter.countryId=115"

  await page.goto(url, {
    waitUntil: "domcontentloaded",
  });

  // Get page data
  const jobs = await page.evaluate(() => {


    const jobList = document.querySelectorAll(`[data-test="job-link"]`);

    return Array.from(jobList).map((job) => {
        const companyLogo = job.querySelector("img").src;
        const jobTech = job.querySelector("div div div div").innerText;
        const jobTitle = job.querySelector(".job-title").innerText;
    
        return { companyLogo, jobTech, jobTitle };
    });

  });

  // Display the quotes
  console.log(jobs);

  return jobs;
};

// These two input parameters are added to filter the data by defualt they are null
getJobInfo("Software Engineer", "Mumbai");