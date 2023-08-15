import puppeteer from "puppeteer";


// This script will filter based on any location or job type
// Example output format =>   {
//     companyName: 'Bank of America',
//     companyLogo: 'https://media.glassdoor.com/sql/8874/bank-of-america-squarelogo-1569440203452.png',
//     companySalaryLink: '/Salary/Bank-of-America-Salaries-E8874.htm',
//     companyJobLink: '/Jobs/Bank-of-America-Jobs-E8874.htm'
//   }


const getCompanies = async (locName, occ) => {
    const browser = await puppeteer.launch({
        headless: true,
    });

    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36');

    const companies = [];

    let url = "https://www.glassdoor.co.in/Reviews/index.htm?"

    if(locName!=null){
        url += "locName=" + locName +"&";
    }
    if(occ!=null){
        url += "occ=" + occ +"&";
    }

    try {
        for (let i = 1; i <= 3; i++) {

            await page.goto(`${url}page=${i}`, {
                waitUntil: "domcontentloaded",
            });


            const pageCompanies = await page.evaluate(() => {
                const companyList = document.querySelectorAll('[data-test="employer-card-single"]');

                console.log(companyList)

                return Array.from(companyList).map((quote) => {

                    const companyName = quote.querySelector('[data-test="employer-short-name"]').innerText;
                    const companyLogo = quote.querySelector('[data-test="employer-logo"]').src;
                    const companySalaryLink = quote.querySelector('[data-test="cell-Salaries-url"]').getAttribute("href");
                    const companyJobLink = quote.querySelector('[data-test="cell-Jobs-url"]').getAttribute("href");

                    return { companyName, companyLogo, companySalaryLink, companyJobLink };
                });
            });

            companies.push(...pageCompanies);
        }
    } catch (error) {
        console.error("An error occurred:", error);
    } finally {
        await browser.close();
    }

    return companies;
};

// If we want to filter based on any location or jobType will pass it in the arguments while calling the function

getCompanies().then((companies) => {
    console.log(companies);
}).catch((error) => {
    console.error("An error occurred:", error);
});
