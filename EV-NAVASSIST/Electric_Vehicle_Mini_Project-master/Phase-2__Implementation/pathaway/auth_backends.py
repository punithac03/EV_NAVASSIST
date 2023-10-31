from pathaway.models import PathawayUsers

class PathawayUsersAuthBackend:
    def authenticate(self, request, username=None, password=None):
        try:
            user = PathawayUsers.objects.get(username=username, password=password)
        except PathawayUsers.DoesNotExist:
            return None

        # Update the user's isactive field to 1 upon successful authentication
        user.isactive = 1
        user.save()

        return user

    def get_user(self, user_id):
        try:
            return PathawayUsers.objects.get(pk=user_id)
        except PathawayUsers.DoesNotExist:
            return None
