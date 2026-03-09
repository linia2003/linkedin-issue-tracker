let allIssues = [];

//Fetching issues from api
async function loadIssues() {
    try {
        const res = await fetch('https://phi-lab-server.vercel.app/api/v1/lab/issues');
        const response = await res.json();

        if (response.status === "success") {
            allIssues = response.data;
            renderIssues(allIssues);
        }
    } catch (error) {
        console.error("Error fetching issues:", error);
    }
}

const renderIssues = (issues) => {
    const container = document.getElementById('issue-container');
    const issueCount = document.getElementById('issue-count');
    const openCount = document.getElementById('open-count');
    const closedCount = document.getElementById('closed-count');

    issueCount.innerText = issues.length;
    openCount.innerText = issues.filter(i => i.status === 'open').length;
    closedCount.innerText = issues.filter(i => i.status === 'closed').length;

    if (issues.length === 0) {
        container.innerHTML = `<p class="col-span-full text-center py-10 text-gray-400">No issues found.</p>`;
        return;
    }

    container.innerHTML = issues.map(({ id, title, description, status, author, labels, priority, createdAt }) => {
        const borderClass = status === 'open' ? 'border-t-[#00a96e]' : 'border-t-[#a855f7]';
        
        const p = priority.toLowerCase();
        let pStyle = "color: #9CA3AF; background-color: #EEEFF2;"; // Default Low
        if (p === 'high') pStyle = "color: #EF4444; background-color: #FEECEC;";
        else if (p === 'medium') pStyle = "color: #F59E0B; background-color: #FFF6D1;";

        const statusImg = status === 'open' ? './assets/Open-Status.png' : './assets/Closed- Status .png';

        return `
        <div onclick="viewIssueDetails(${id})" class="bg-white rounded-xl border-t-4 ${borderClass} border-x border-b border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden">
            <div class="p-6">
                <div class="flex justify-between items-center mb-4">
                    <img src="${statusImg}" class="w-8 h-8" alt="${status}">
                    <span style="${pStyle}" class="px-3 py-1 text-xs font-bold rounded-full uppercase">
                        ${priority}
                    </span>
                </div>
                
                <h3 class="text-[#1e293b] font-bold text-lg mb-2 line-clamp-2">${title}</h3>
                <p class="text-gray-500 text-sm mb-4 line-clamp-2">${description}</p>
                
                <div class="flex flex-wrap gap-2 mb-6">
                    ${labels.map(l => {
                        const labelText = l.toLowerCase();
                        let icon = '<i class="fa-solid fa-circle-info text-[10px]"></i>';
                        let styleClass = 'text-[#D97706] bg-[#FDE68A] border-[#FFF8DB]'; 

                        if (labelText === 'bug') {
                            icon = '<i class="fa-solid fa-bug" style="color: rgb(123, 14, 14);"></i>';
                            styleClass = 'text-[#EF4444] bg-[#FECACA] border-[#FEECEC]';
                        } else if (labelText === 'enhancement') {
                            icon = '<i class="fa-solid fa-wand-magic-sparkles" style="color: rgb(25, 121, 81);"></i>';
                            styleClass = 'text-[#00a96e] bg-[#bbf7d0] border-[#defce8]';
                        } else if (labelText === 'help wanted') {
                            icon = '<i class="fa-solid fa-life-ring" style="color: rgb(147, 79, 16);"></i>';
                            styleClass = 'text-[#D97706] bg-[#FDE68A] border-[#FFF8DB]';
                        } else if (labelText === 'documentation') {
                            icon = '<i class="fa-regular fa-file-lines" style="color: rgb(177, 143, 15);"></i>';
                            styleClass = 'text-[#B18F0F] bg-[#FEF9C3] border-[#FEF08A]';
                        }
                        
                        return `<span class="border ${styleClass} text-[10px] px-3 py-1 rounded-full flex items-center gap-1 font-bold uppercase">
                            ${icon} ${l}
                        </span>`;
                    }).join('')}
                </div>
            </div>

            <div class="px-6 py-4 bg-white border-t border-gray-100">
                <p class="text-gray-500 text-sm mb-1">#${id} by ${author}</p>
                <p class="text-gray-400 text-xs">${new Date(createdAt).toLocaleDateString()}</p>
            </div>
        </div>
    `}).join('');
};

// inside card part
async function viewIssueDetails(id) {
    const modal = document.getElementById('issue_modal');
    const content = document.getElementById('modal-content');
    
    content.innerHTML = `
        <div class="flex justify-center py-10">
            <span class="loading loading-spinner loading-lg text-[#4a00ff]"></span>
        </div>`;
    
    modal.showModal();

    try {
        const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`);
        const result = await res.json();
        const issue = result.data;

        const statusImg = issue.status === 'open' ? './assets/Open-Status.png' : './assets/Closed- Status .png';

        content.innerHTML = `
            <div class="space-y-6">
                <h2 class="text-3xl font-bold text-[#1e293b]">${issue.title}</h2>
                
                <div class="flex items-center gap-2 text-gray-500 text-sm">
                    <span class="bg-[#00a96e] text-white px-3 py-1 rounded-full font-semibold flex items-center gap-1">
                        ${issue.status === 'open' ? 'Opened' : 'Closed'}
                    </span>
                    <span>•</span>
                    <span>Opened by ${issue.author}</span>
                    <span>•</span>
                    <span>${new Date(issue.createdAt).toLocaleDateString('en-GB')}</span>
                </div>

                <div class="flex flex-wrap gap-2">
                    ${issue.labels.map(l => {
                        const labelText = l.toLowerCase();
                        let icon = '<i class="fa-solid fa-circle-info text-[10px]"></i>';
                        let styleClass = 'text-[#D97706] bg-[#FDE68A] border-[#FFF8DB]';

                        if (labelText === 'bug') {
                            icon = '<i class="fa-solid fa-bug" style="color: rgb(123, 14, 14);"></i>';
                            styleClass = 'text-[#EF4444] bg-[#FECACA] border-[#FEECEC]';
                        } else if (labelText === 'help wanted') {
                            icon = '<i class="fa-solid fa-life-ring" style="color: rgb(147, 79, 16);"></i>';
                            styleClass = 'text-[#D97706] bg-[#FDE68A] border-[#FFF8DB]';
                        } else if (labelText === 'enhancement') {
                            icon = '<i class="fa-solid fa-wand-magic-sparkles" style="color: rgb(25, 121, 81);"></i>';
                            styleClass = 'text-[#00a96e] bg-[#bbf7d0] border-[#defce8]';
                        } else if (labelText === 'documentation') {
                            icon = '<i class="fa-regular fa-file-lines" style="color: rgb(177, 143, 15);"></i>';
                            styleClass = 'text-[#B18F0F] bg-[#FEF9C3] border-[#FEF08A]';
                        }
                            
                        return `
                            <span class="border ${styleClass} px-3 py-1 rounded-full text-xs font-bold uppercase flex items-center gap-1">
                                ${icon} ${l}
                            </span>
                        `;
                    }).join('')}
                </div>

                <p class="text-gray-600 text-lg leading-relaxed">
                    ${issue.description}
                </p>

                <div class="bg-gray-50 rounded-xl p-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <p class="text-gray-500 text-sm mb-1">Assignee:</p>
                        <p class="text-[#1e293b] font-bold text-lg">${issue.author}</p>
                    </div>
                    <div>
                        <p class="text-gray-500 text-sm mb-1">Priority:</p>
                        ${(() => {
                            const p = issue.priority.toLowerCase();
                            let pStyle = "";
                            if (p === 'high') pStyle = "color: #EF4444; background-color: #FEECEC;";
                            else if (p === 'medium') pStyle = "color: #F59E0B; background-color: #FFF6D1;";
                            else if (p === 'low') pStyle = "color: #9CA3AF; background-color: #EEEFF2;";
                            
                            return `<span style="${pStyle}" class="px-4 py-1 rounded-lg font-bold uppercase text-sm">
                                ${issue.priority}
                            </span>`;
                        })()}
                    </div>
                </div>

                <div class="flex justify-end pt-4">
                    <form method="dialog">
                        <button class="btn bg-[#4a00ff] hover:bg-[#3d00cc] text-white px-8 border-none text-lg normal-case">Close</button>
                    </form>
                </div>
            </div>
        `;
    } catch (error) {
        content.innerHTML = `<p class="text-red-500 p-10 text-center">Failed to load issue details.</p>`;
    }
}

//Login part
function handleLogin() {
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;

    if (user === 'admin' && pass === 'admin123') {
        document.getElementById('login-page').classList.add('hidden');
        document.getElementById('main-dashboard').classList.remove('hidden');
        loadIssues();
        //jodi vul password dei
    } else {
        alert("Invalid Username or Password!");
    }
}

//Search API
const handleSearch = async () => {
    const query = document.getElementById('search-input').value;

    if (!query) {
        renderIssues(allIssues);
        return;
    }

    try {
        const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${query}`);
        const response = await res.json();

        if (response.status === "success") {
            renderIssues(response.data);
        }
    } catch (error) {
        console.error("Error searching issues:", error);
    }
};

//Filtering part
const filterIssues = (statusType) => {
    const buttons = document.querySelectorAll('.flex.flex-wrap.items-center.gap-2 button');
    
    buttons.forEach(btn => {
        btn.classList.remove('bg-[#4a00ff]', 'text-white');
        btn.classList.add('bg-white', 'text-gray-500', 'border', 'border-gray-200');
    });

    const activeButton = Array.from(buttons).find(btn => btn.getAttribute('onclick').includes(`'${statusType}'`));
    if (activeButton) {
        activeButton.classList.remove('bg-white', 'text-gray-500', 'border', 'border-gray-200');
        activeButton.classList.add('bg-[#4a00ff]', 'text-white', 'border-none');
    }

    if (statusType === 'all') {
        renderIssues(allIssues);
    } else {
        const filtered = allIssues.filter(issue => issue.status === statusType);
        renderIssues(filtered);
    }
};