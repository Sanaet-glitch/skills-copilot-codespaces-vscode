function skillsMember() {
  const member = document.querySelector('.member');
  const memberSkills = document.querySelector('.member-skills');
  const memberSkillsClose = document.querySelector('.member-skills-close');
  const memberSkillsList = document.querySelector('.member-skills-list');
  const memberSkillsListItems = document.querySelectorAll('.member-skills-list-item');

  member.addEventListener('click', () => {
    memberSkills.classList.add('active');
  });

  memberSkillsClose.addEventListener('click', () => {
    memberSkills.classList.remove('active');
  });

  memberSkillsListItems.forEach((item) => {
    item.addEventListener('click', () => {
      memberSkillsListItems.forEach((item) => {
        item.classList.remove('active');
      });
      item.classList.add('active');
    });
  });
}