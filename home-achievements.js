/* Profile presentation reads the shared ledger; rank is never stored in a draft. */
(() => {
 const button=document.getElementById('blog-badge');if(!button)return;
 const detail=document.getElementById('badge-detail'),label=document.getElementById('blog-badge-label');
 const t=s=>window.ActivityHubI18n.t(s);
 window.ActivityHubI18n.register({'Badges':'バッジ','Complete a blog entry to earn your first badge.':'ブログを書いて、最初のバッジを獲得しよう。','Budding Journalist':'かけだしジャーナリスト','Green':'グリーン','Bronze':'ブロンズ','Silver':'シルバー','Gold':'ゴールド','Diamond':'ダイヤモンド'});
 function render(){
  const {count,rank,next}=ActivityAchievements.blogProgress();button.hidden=!rank;document.getElementById('badge-empty').hidden=!!rank;
  if(!rank){detail.hidden=true;button.setAttribute('aria-expanded','false');return;}
  const rankName=rank.id[0].toUpperCase()+rank.id.slice(1);
  document.getElementById('blog-badge-icon').src='shared/badges/blog-'+rank.id+'.svg';
  button.setAttribute('aria-label',t('Budding Journalist')+' · '+t(rankName));
  label.textContent=t('Budding Journalist');
  const description=document.getElementById('badge-description');
  const ja=ActivityHubI18n.language==='ja';
  description.textContent=ja?`ブログを${count}件完成！各レッスンは1回だけカウントされます。`:`You completed ${count} blog ${count===1?'entry':'entries'}! Each lesson counts once.`;
  description.textContent+=next?(ja?` 次のランクまで：${count}/${next.count}件。`:` Next rank: ${count}/${next.count} entries.`):(ja?' 最高ランクを獲得！':' You reached the highest rank!');
 }
 button.addEventListener('click',()=>{detail.hidden=!detail.hidden;button.setAttribute('aria-expanded',String(!detail.hidden));});
 document.getElementById('home-profile').addEventListener('click',render);
 window.addEventListener('storage',render);window.addEventListener('focus',render);window.addEventListener('pageshow',render);window.addEventListener('letseigo:achievementschange',render);
 document.addEventListener('activityhub:languagechange',render);render();
})();
