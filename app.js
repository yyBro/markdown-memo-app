// ===== 상태 관리 =====
class MemoApp {
    constructor() {
        this.memos = this.loadMemos();
        this.currentMemoId = null;
        this.initializeElements();
        this.bindEvents();
        this.renderMemoList();
        
        // 첫 번째 메모 선택 또는 새 메모 생성
        if (this.memos.length > 0) {
            this.selectMemo(this.memos[0].id);
        } else {
            this.createNewMemo();
        }
    }
    
    initializeElements() {
        this.elements = {
            memoList: document.getElementById('memoList'),
            editor: document.getElementById('editor'),
            preview: document.getElementById('preview'),
            memoTitle: document.getElementById('memoTitle'),
            newMemoBtn: document.getElementById('newMemoBtn'),
            saveBtn: document.getElementById('saveBtn'),
            deleteBtn: document.getElementById('deleteBtn'),
            searchInput: document.getElementById('searchInput')
        };
    }
    
    bindEvents() {
        // 에디터 입력 이벤트
        this.elements.editor.addEventListener('input', () => {
            this.updatePreview();
            this.autoSave();
        });
        
        // 제목 입력 이벤트
        this.elements.memoTitle.addEventListener('input', () => {
            this.autoSave();
        });
        
        // 새 메모 버튼
        this.elements.newMemoBtn.addEventListener('click', () => {
            this.createNewMemo();
        });
        
        // 저장 버튼
        this.elements.saveBtn.addEventListener('click', () => {
            this.saveMemo();
            this.showNotification('메모가 저장되었습니다! 💾');
        });
        
        // 삭제 버튼
        this.elements.deleteBtn.addEventListener('click', () => {
            if (confirm('이 메모를 삭제하시겠습니까?')) {
                this.deleteMemo();
            }
        });
        
        // 검색 입력
        this.elements.searchInput.addEventListener('input', (e) => {
            this.filterMemos(e.target.value);
        });
        
        // 키보드 단축키
        document.addEventListener('keydown', (e) => {
            // Ctrl+S 또는 Cmd+S: 저장
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                this.saveMemo();
                this.showNotification('메모가 저장되었습니다! 💾');
            }
            // Ctrl+N 또는 Cmd+N: 새 메모
            if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
                e.preventDefault();
                this.createNewMemo();
            }
        });
    }
    
    // ===== 메모 관리 =====
    loadMemos() {
        const stored = localStorage.getItem('memos');
        return stored ? JSON.parse(stored) : [];
    }
    
    saveMemos() {
        localStorage.setItem('memos', JSON.stringify(this.memos));
    }
    
    createNewMemo() {
        const newMemo = {
            id: Date.now().toString(),
            title: '새 메모',
            content: '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        this.memos.unshift(newMemo);
        this.saveMemos();
        this.renderMemoList();
        this.selectMemo(newMemo.id);
        
        // 제목 입력에 포커스
        this.elements.memoTitle.select();
    }
    
    saveMemo() {
        if (!this.currentMemoId) return;
        
        const memo = this.memos.find(m => m.id === this.currentMemoId);
        if (memo) {
            memo.title = this.elements.memoTitle.value || '제목 없음';
            memo.content = this.elements.editor.value;
            memo.updatedAt = new Date().toISOString();
            this.saveMemos();
            this.renderMemoList();
        }
    }
    
    deleteMemo() {
        if (!this.currentMemoId) return;
        
        this.memos = this.memos.filter(m => m.id !== this.currentMemoId);
        this.saveMemos();
        this.renderMemoList();
        
        // 다른 메모 선택 또는 새 메모 생성
        if (this.memos.length > 0) {
            this.selectMemo(this.memos[0].id);
        } else {
            this.createNewMemo();
        }
        
        this.showNotification('메모가 삭제되었습니다! 🗑️');
    }
    
    selectMemo(id) {
        this.currentMemoId = id;
        const memo = this.memos.find(m => m.id === id);
        
        if (memo) {
            this.elements.memoTitle.value = memo.title;
            this.elements.editor.value = memo.content;
            this.updatePreview();
            this.updateActiveState();
        }
    }
    
    autoSave() {
        // 디바운스를 사용하여 자동 저장
        clearTimeout(this.autoSaveTimeout);
        this.autoSaveTimeout = setTimeout(() => {
            this.saveMemo();
        }, 1000);
    }
    
    // ===== UI 업데이트 =====
    renderMemoList(filteredMemos = null) {
        const memosToRender = filteredMemos || this.memos;
        
        if (memosToRender.length === 0) {
            this.elements.memoList.innerHTML = `
                <div style="padding: 2rem; text-align: center; color: var(--text-tertiary);">
                    ${filteredMemos ? '검색 결과가 없습니다' : '메모가 없습니다.<br>새 메모를 만들어보세요!'}
                </div>
            `;
            return;
        }
        
        this.elements.memoList.innerHTML = memosToRender.map(memo => `
            <div class="memo-item ${memo.id === this.currentMemoId ? 'active' : ''}" 
                 data-id="${memo.id}">
                <div class="memo-item-title">${this.escapeHtml(memo.title)}</div>
                <div class="memo-item-preview">${this.escapeHtml(memo.content.substring(0, 60))}${memo.content.length > 60 ? '...' : ''}</div>
                <div class="memo-item-date">${this.formatDate(memo.updatedAt)}</div>
            </div>
        `).join('');
        
        // 메모 아이템 클릭 이벤트
        this.elements.memoList.querySelectorAll('.memo-item').forEach(item => {
            item.addEventListener('click', () => {
                this.selectMemo(item.dataset.id);
            });
        });
    }
    
    updateActiveState() {
        this.elements.memoList.querySelectorAll('.memo-item').forEach(item => {
            if (item.dataset.id === this.currentMemoId) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }
    
    updatePreview() {
        const markdown = this.elements.editor.value;
        
        // marked.js 설정
        marked.setOptions({
            breaks: true,
            gfm: true,
            headerIds: false,
            mangle: false
        });
        
        this.elements.preview.innerHTML = marked.parse(markdown);
    }
    
    filterMemos(query) {
        if (!query.trim()) {
            this.renderMemoList();
            return;
        }
        
        const filtered = this.memos.filter(memo => 
            memo.title.toLowerCase().includes(query.toLowerCase()) ||
            memo.content.toLowerCase().includes(query.toLowerCase())
        );
        
        this.renderMemoList(filtered);
    }
    
    // ===== 유틸리티 =====
    formatDate(isoString) {
        const date = new Date(isoString);
        const now = new Date();
        const diff = now - date;
        
        // 1분 미만
        if (diff < 60000) {
            return '방금 전';
        }
        // 1시간 미만
        if (diff < 3600000) {
            return `${Math.floor(diff / 60000)}분 전`;
        }
        // 24시간 미만
        if (diff < 86400000) {
            return `${Math.floor(diff / 3600000)}시간 전`;
        }
        // 그 외
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        
        if (now.getFullYear() === year) {
            return `${month}/${day} ${hours}:${minutes}`;
        }
        return `${year}/${month}/${day}`;
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    showNotification(message) {
        // 간단한 토스트 알림 표시
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            padding: 1rem 1.5rem;
            background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
            color: white;
            border-radius: 10px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
            font-weight: 600;
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }
}

// ===== 애니메이션 스타일 추가 =====
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateY(100px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateY(0);
            opacity: 1;
        }
        to {
            transform: translateY(100px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ===== 앱 초기화 =====
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new MemoApp();
});